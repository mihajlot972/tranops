import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SOCKET_URL
    || "https://acetaxi-bridge.qryde.net";
const SOCKET_PATH = "/organization/wfm/api/socket.io/socket.io/";

// Socket instance
let socket: Socket | null = null;
let isConnected = false;

// Generate a random device ID
const generateDeviceId = (): string => {
    return 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    });
};

const deviceID = generateDeviceId();

// Error message mapping
const errorMessages: Record<string, string> = {
    'auth.invalidCredentials': 'Invalid username or password',
    'auth.userNotFound': 'User not found',
    'auth.accountLocked': 'Account is locked. Please contact support',
    'auth.accountDisabled': 'Account is disabled',
    'auth.sessionExpired': 'Session expired. Please login again',
    'auth.unauthorized': 'Unauthorized access',
};

const formatErrorMessage = (error: string): string => {
    return errorMessages[error] || error;
};

// Token storage keys
const TOKEN_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * Decode JWT payload without validation (client-side only)
 */
const decodeJwtPayload = (token: string): { exp?: number; [key: string]: unknown } | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) return true;
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= payload.exp * 1000;
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Store tokens in localStorage
 */
const storeTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Clear tokens from localStorage
 */
const clearTokens = (): void => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// Types
export interface LoginCredentials {
    email: string;
    password: string;
    tenantId?: string;
}

export interface LoginResponseData {
    AUTH_TOKEN?: string;
    USER_ID?: string;
    USER_NAME?: string;
    accessToken?: string;
    refreshToken?: string;
    [key: string]: unknown;
}

export interface LoginResponse {
    header?: {
        deviceID?: string;
        origin?: string;
        commandId?: string;
    };
    status: string;
    data?: LoginResponseData[] | LoginResponseData | { error: string };
    error?: string;
    message?: string;
}

export interface UserData {
    username: string;
    authToken?: string;
    userId?: string;
}

/**
 * Get or create socket connection
 */
const getSocket = (): Socket => {
    if (!socket) {
        console.log("Connecting to socket:", SOCKET_URL, "path:", SOCKET_PATH);
        socket = io(SOCKET_URL, {
            path: SOCKET_PATH,
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            isConnected = true;
            console.log('Socket connected:', socket?.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connect_error:', error);
        });

        socket.on('disconnect', (reason) => {
            isConnected = false;
            console.log('Socket disconnected:', reason);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }
    return socket;
};

/**
 * Login function using Socket.IO
 */
export const login = (credentials: LoginCredentials): Promise<UserData> => {
    const { email, password } = credentials;

    console.log("Socket Login - Sending request");

    return new Promise((resolve, reject) => {
        const sock = getSocket();

        const payload = {
            header: {
                authorization: "",
                deviceID: deviceID,
                origin: "Consumer Portal",
                commandId: "login"
            },
            data: {
                username: email,
                password: password
            }
        };

        console.log("Sending login payload:", payload);

        // Listen for response
        const handleResponse = (response: unknown) => {
            console.log("Login response received:", response);
            sock.off('message', handleResponse);

            try {
                // Response can be array [eventName, data] or direct object
                let parsed: LoginResponse;
                if (typeof response === 'string') {
                    const jsonParsed = JSON.parse(response);
                    parsed = Array.isArray(jsonParsed) ? jsonParsed[1] : jsonParsed;
                } else if (Array.isArray(response)) {
                    parsed = response[1] as LoginResponse;
                } else {
                    parsed = response as LoginResponse;
                }

                if (parsed.status === 'OK') {
                    // Handle successful login
                    const responseData = parsed.data;
                    let userData: LoginResponseData | undefined;

                    if (Array.isArray(responseData)) {
                        userData = responseData[0];
                    } else if (responseData && !('error' in responseData)) {
                        userData = responseData as LoginResponseData;
                    }

                    if (userData) {
                        // Store auth token in cookie if available
                        if (userData.AUTH_TOKEN) {
                            Cookies.set("authToken", userData.AUTH_TOKEN);
                        }
                        // Store access and refresh tokens in localStorage
                        if (userData.accessToken && userData.refreshToken) {
                            storeTokens(userData.accessToken, userData.refreshToken);
                        }
                        resolve({
                            username: userData.USER_NAME || email,
                            authToken: userData.AUTH_TOKEN || userData.accessToken,
                            userId: userData.USER_ID,
                        });
                    } else {
                        reject(new Error('Invalid response data'));
                    }
                } else {
                    // Handle error response
                    const errorData = parsed.data as { error?: string } | undefined;
                    const rawError = errorData?.error || parsed.error || parsed.message || 'Login failed';
                    const errorMsg = formatErrorMessage(rawError);
                    reject(new Error(errorMsg));
                }
            } catch (e) {
                console.error('Parse error:', e);
                reject(new Error('Failed to parse login response'));
            }
        };

        sock.on('message', handleResponse);

        // Send the message
        sock.emit('message', JSON.stringify(payload));

        // Timeout after 30 seconds
        setTimeout(() => {
            sock.off('message', handleResponse);
            reject(new Error('Login timeout'));
        }, 30000);
    });
};

/**
 * Temp password login using Socket.IO
 */
export const tempPassLogin = (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { email, password } = credentials;

    console.log("Socket TempPassLogin - Sending request");

    return new Promise((resolve, reject) => {
        const sock = getSocket();

        const payload = {
            header: {
                authorization: "",
                deviceID: deviceID,
                origin: "Consumer Portal",
                commandId: "login"
            },
            data: {
                username: email,
                password: password
            }
        };

        console.log("Sending temp pass login payload:", payload);

        // Listen for response
        const handleResponse = (response: string | LoginResponse) => {
            console.log("Temp pass login response received:", response);
            sock.off('message', handleResponse);

            try {
                const data: LoginResponse = typeof response === 'string' ? JSON.parse(response) : response;
                resolve(data);
            } catch (e) {
                reject(new Error('Failed to parse login response'));
            }
        };

        sock.on('message', handleResponse);

        // Send the message
        sock.emit('message', JSON.stringify(payload));

        // Timeout after 30 seconds
        setTimeout(() => {
            sock.off('message', handleResponse);
            reject(new Error('Login timeout'));
        }, 30000);
    });
};

/**
 * Logout function - clears all auth data and disconnects socket
 */
export const logout = (): void => {
    // Disconnect socket
    if (socket) {
        socket.disconnect();
        socket = null;
        isConnected = false;
    }

    // Remove auth token cookie
    Cookies.remove("authToken");

    // Clear access and refresh tokens from localStorage
    clearTokens();

    // Clear session storage
    sessionStorage.removeItem("tenantName");
    sessionStorage.removeItem("user");

    // Clear any other auth-related data
    localStorage.removeItem("user");

    console.log("Logout - User logged out, auth data cleared, socket disconnected");
};

/**
 * Check if user is authenticated (token exists and not expired)
 */
export const isAuthenticated = (): boolean => {
    const accessToken = getAccessToken();
    // If we have an access token, check if it's expired
    if (accessToken) {
        return !isTokenExpired(accessToken);
    }
    // Fallback to cookie check for backwards compatibility
    return !!Cookies.get("authToken");
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | undefined => {
    return Cookies.get("authToken");
};

/**
 * Get socket instance (for other services that need it)
 */
export const getSocketInstance = (): Socket => {
    return getSocket();
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
    return isConnected;
};

export default { login, tempPassLogin, logout, isAuthenticated, getAuthToken, getAccessToken, getRefreshToken, isTokenExpired, getSocketInstance, isSocketConnected };
