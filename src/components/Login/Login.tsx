import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { login, UserData } from '@/services/restAuthService';

interface LoginProps {
  onLogin: (userData: UserData) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await login({
        email: username,
        password: password,
      });
      onLogin(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 animate-in fade-in duration-300">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">TranOps</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              className="h-11"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="h-11 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button type="button" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Powered by QRyde</p>
        </div>
      </div>
    </div>
  );
}
