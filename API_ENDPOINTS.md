# TranOps API Endpoints Documentation

## Base URLs

| Service | URL Pattern |
|---------|-------------|
| Authentication | `wss://acetaxi-bridge.qryde.net` (Socket.IO) |
| ControlOps API | `https://{tenantName}-bridge.qryde.net/controlops/api` |

---

## Authentication (Socket.IO)

### Connection

```
URL: https://acetaxi-bridge.qryde.net
Path: /organization/wfm/api/socket.io/socket.io/
Transport: websocket
```

### Login

| Property | Value |
|----------|-------|
| Event | `message` |
| Command ID | `login` |

**Headers:**
```json
{
  "authorization": "",
  "deviceID": "<generated-uuid>",
  "origin": "Consumer Portal",
  "commandId": "login"
}
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:**
```json
{
  "status": "OK",
  "data": {
    "AUTH_TOKEN": "string",
    "USER_ID": "string",
    "USER_NAME": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Error Response:**
```json
{
  "status": "ERROR",
  "error": "string",
  "message": "string"
}
```

**Error Codes:**

| Code | Message |
|------|---------|
| `auth.invalidCredentials` | Invalid username or password |
| `auth.userNotFound` | User not found |
| `auth.accountLocked` | Account is locked. Please contact support |
| `auth.accountDisabled` | Account is disabled |
| `auth.sessionExpired` | Session expired. Please login again |
| `auth.unauthorized` | Unauthorized access |

---

## ControlOps API

All endpoints require authentication header:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### GET /workflows

Fetch all workflows.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "workflow_id": "string",
      "name": "string",
      "description": "string",
      "enabled": true,
      "stream": "string",
      "version": "string"
    }
  ]
}
```

---

### GET /streams

Fetch all streams.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "stream_id": "string",
      "name": "string"
    }
  ]
}
```

---

### GET /actors

Fetch all actors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "actor_id": "string",
      "name": "string"
    }
  ]
}
```

---

### POST /workflows/{workflowId}/execute

Execute a specific workflow.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workflowId` | string | ID of workflow to execute |

**Request Body:**
```json
{
  "key": "value"
}
```
*Custom parameters based on workflow requirements*

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## Data Models

### Workflow

```typescript
{
  workflow_id: string
  name: string
  description: string
  enabled: boolean
  stream: string
  version: string
}
```

### Stream

```typescript
{
  stream_id: string
  name: string
}
```

### Actor

```typescript
{
  actor_id: string
  name: string
}
```

### Live Call

```typescript
{
  callId: string
  phone: string
  phoneFormatted?: string
  status: 'live'
  startTime: string           // ISO 8601
  agentName?: string
  location: CallLocation
  transcript: TranscriptEntry[]
}
```

### Queue Call

```typescript
{
  callId: string
  phone: string
  phoneFormatted?: string
  status: 'queue'
  queuePosition: number
  queueStartTime: string      // ISO 8601
  location: CallLocation
}
```

### Call Location

```typescript
{
  city: string
  state: string
  country: string
  region?: string
  display: string
  isApproximate?: boolean
}
```

### Trip

```typescript
{
  tripId: string
  callId: string
  tripType: string
  passengerName: string
  passengerPhone: string
  pickup: string
  dropoff: string
  returnPickup?: string
  returnDropoff?: string
  scheduledDate: string       // ISO 8601
  scheduledTime: string
  returnTime?: string
  createdAt: string           // ISO 8601
  notes?: string
  driver?: string | null
  vehicle?: string | null
}
```

---

## Token Management

| Token | Storage | Key |
|-------|---------|-----|
| Access Token | localStorage | `accessToken` |
| Refresh Token | localStorage | `refreshToken` |
| Auth Token | Cookie | `authToken` |

**Token Check Interval:** 60 seconds

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SOCKET_URL` | Socket.IO server URL | `https://acetaxi-bridge.qryde.net` |
