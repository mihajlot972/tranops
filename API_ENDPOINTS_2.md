# Call Center API Endpoints

API documentation for live calls, trips, ride assignments, and related services.

---

## Base URL

```
https://{tenant}-bridge.{domain}/callcenter/api
```

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 1. Live Calls

### GET /calls/live

Fetch all active/live calls.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "callId": "string",
      "phone": "string",
      "phoneFormatted": "string",
      "status": "live",
      "startTime": "ISO8601 datetime",
      "agentName": "string",
      "location": {
        "city": "string",
        "state": "string",
        "region": "string",
        "country": "string",
        "display": "string",
        "isApproximate": "boolean"
      },
      "transcript": [
        {
          "role": "caller | agent | system",
          "text": "string",
          "timestamp": "string"
        }
      ]
    }
  ]
}
```

---

### GET /calls/live/{callId}

Fetch single live call details.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Response:**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "phone": "string",
    "phoneFormatted": "string",
    "status": "live",
    "startTime": "ISO8601 datetime",
    "agentName": "string",
    "location": {
      "city": "string",
      "state": "string",
      "region": "string",
      "country": "string",
      "display": "string",
      "isApproximate": "boolean"
    },
    "transcript": [
      {
        "role": "caller | agent | system",
        "text": "string",
        "timestamp": "string"
      }
    ]
  }
}
```

---

### POST /calls/{callId}/answer

Answer a call from the queue.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Request Body:**
```json
{
  "agentId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "string",
  "answeredAt": "ISO8601 datetime"
}
```

---

### POST /calls/{callId}/end

End an active call.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Request Body:**
```json
{
  "reason": "string",
  "outcome": "accepted | rejected | missed | transferred"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "string",
  "endedAt": "ISO8601 datetime"
}
```

---

### POST /calls/{callId}/transfer

Transfer a call to another destination.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Request Body:**
```json
{
  "destination": "string",
  "destinationType": "agent | department | external",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "string",
  "destination": "string",
  "transferredAt": "ISO8601 datetime"
}
```

---

### POST /calls/{callId}/flag

Flag a call for review.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Request Body:**
```json
{
  "reason": "string",
  "priority": "low | medium | high",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "string",
  "flaggedAt": "ISO8601 datetime"
}
```

---

## 2. Queue Calls

### GET /calls/queue

Fetch all calls in queue.

**Query Parameters:**
| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| region    | string | No       | Filter by region               |
| limit     | number | No       | Max results (default: 50)      |
| offset    | number | No       | Pagination offset              |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "callId": "string",
      "phone": "string",
      "phoneFormatted": "string",
      "status": "queue",
      "queuePosition": "number",
      "queueStartTime": "ISO8601 datetime",
      "location": {
        "city": "string",
        "state": "string",
        "region": "string",
        "country": "string",
        "display": "string",
        "isApproximate": "boolean"
      }
    }
  ],
  "total": "number"
}
```

---

## 3. Trips

### GET /trips

Fetch all trips.

**Query Parameters:**
| Parameter  | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| status     | string | No       | Filter: pending, assigned, completed, cancelled|
| tripType   | string | No       | Filter: round-trip, one-way, same-day, wheelchair |
| dateFrom   | string | No       | ISO8601 date                                   |
| dateTo     | string | No       | ISO8601 date                                   |
| limit      | number | No       | Max results (default: 50)                      |
| offset     | number | No       | Pagination offset                              |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tripId": "string",
      "callId": "string",
      "tripType": "round-trip | one-way | same-day | wheelchair",
      "passengerName": "string",
      "passengerPhone": "string",
      "pickup": "string",
      "dropoff": "string",
      "returnPickup": "string | null",
      "returnDropoff": "string | null",
      "scheduledDate": "ISO8601 datetime",
      "scheduledTime": "string",
      "returnTime": "string | null",
      "createdAt": "ISO8601 datetime",
      "notes": "string",
      "driver": "string | null",
      "vehicle": "string | null",
      "status": "string"
    }
  ],
  "total": "number"
}
```

---

### GET /trips/{tripId}

Fetch single trip details.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| tripId    | string | Yes      | Unique trip ID   |

**Response:**
```json
{
  "success": true,
  "data": {
    "tripId": "string",
    "callId": "string",
    "tripType": "round-trip | one-way | same-day | wheelchair",
    "passengerName": "string",
    "passengerPhone": "string",
    "pickup": "string",
    "dropoff": "string",
    "returnPickup": "string | null",
    "returnDropoff": "string | null",
    "scheduledDate": "ISO8601 datetime",
    "scheduledTime": "string",
    "returnTime": "string | null",
    "createdAt": "ISO8601 datetime",
    "notes": "string",
    "driver": "string | null",
    "vehicle": "string | null",
    "status": "string"
  }
}
```

---

### POST /trips

Create a new trip.

**Request Body:**
```json
{
  "callId": "string",
  "tripType": "round-trip | one-way | same-day | wheelchair",
  "passengerName": "string",
  "passengerPhone": "string",
  "pickup": "string",
  "dropoff": "string",
  "returnPickup": "string | null",
  "returnDropoff": "string | null",
  "scheduledDate": "ISO8601 datetime",
  "scheduledTime": "string",
  "returnTime": "string | null",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tripId": "string",
    "createdAt": "ISO8601 datetime"
  }
}
```

---

### PUT /trips/{tripId}

Update an existing trip.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| tripId    | string | Yes      | Unique trip ID   |

**Request Body:**
```json
{
  "tripType": "round-trip | one-way | same-day | wheelchair",
  "passengerName": "string",
  "passengerPhone": "string",
  "pickup": "string",
  "dropoff": "string",
  "returnPickup": "string | null",
  "returnDropoff": "string | null",
  "scheduledDate": "ISO8601 datetime",
  "scheduledTime": "string",
  "returnTime": "string | null",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tripId": "string",
    "updatedAt": "ISO8601 datetime"
  }
}
```

---

### DELETE /trips/{tripId}

Cancel/delete a trip.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| tripId    | string | Yes      | Unique trip ID   |

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "tripId": "string",
  "cancelledAt": "ISO8601 datetime"
}
```

---

## 4. Trip Assignments

### GET /trips/pending-assignment

Fetch trips pending driver/vehicle assignment.

**Query Parameters:**
| Parameter  | Type   | Required | Description                       |
|------------|--------|----------|-----------------------------------|
| tripType   | string | No       | Filter by trip type               |
| region     | string | No       | Filter by region                  |
| limit      | number | No       | Max results                       |
| offset     | number | No       | Pagination offset                 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tripId": "string",
      "callId": "string",
      "tripType": "string",
      "passengerName": "string",
      "passengerPhone": "string",
      "pickup": "string",
      "dropoff": "string",
      "scheduledDate": "ISO8601 datetime",
      "scheduledTime": "string",
      "createdAt": "ISO8601 datetime",
      "notes": "string",
      "driver": null,
      "vehicle": null
    }
  ],
  "total": "number"
}
```

---

### POST /trips/{tripId}/assign

Assign driver and vehicle to a trip.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| tripId    | string | Yes      | Unique trip ID   |

**Request Body:**
```json
{
  "driverId": "string",
  "vehicleId": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "tripId": "string",
  "driverId": "string",
  "vehicleId": "string",
  "assignedAt": "ISO8601 datetime"
}
```

---

### POST /trips/{tripId}/unassign

Remove assignment from a trip.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| tripId    | string | Yes      | Unique trip ID   |

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "tripId": "string",
  "unassignedAt": "ISO8601 datetime"
}
```

---

## 5. Drivers

### GET /drivers

Fetch all available drivers.

**Query Parameters:**
| Parameter  | Type    | Required | Description                    |
|------------|---------|----------|--------------------------------|
| available  | boolean | No       | Filter by availability         |
| region     | string  | No       | Filter by region               |
| vehicleType| string  | No       | Filter by vehicle capability   |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "email": "string",
      "status": "available | busy | offline",
      "currentLocation": {
        "lat": "number",
        "lng": "number"
      },
      "vehicleTypes": ["sedan", "wheelchair", "van"],
      "region": "string"
    }
  ]
}
```

---

### GET /drivers/{driverId}

Fetch single driver details.

**Path Parameters:**
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| driverId  | string | Yes      | Unique driver ID  |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "status": "available | busy | offline",
    "currentLocation": {
      "lat": "number",
      "lng": "number"
    },
    "vehicleTypes": ["sedan", "wheelchair", "van"],
    "region": "string",
    "assignedTrips": ["tripId1", "tripId2"]
  }
}
```

---

## 6. Vehicles

### GET /vehicles

Fetch all available vehicles.

**Query Parameters:**
| Parameter  | Type    | Required | Description                    |
|------------|---------|----------|--------------------------------|
| available  | boolean | No       | Filter by availability         |
| type       | string  | No       | sedan, wheelchair, van         |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "sedan | wheelchair | van | transit",
      "licensePlate": "string",
      "capacity": "number",
      "wheelchairAccessible": "boolean",
      "status": "available | in-use | maintenance"
    }
  ]
}
```

---

### GET /vehicles/{vehicleId}

Fetch single vehicle details.

**Path Parameters:**
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| vehicleId | string | Yes      | Unique vehicle ID  |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "sedan | wheelchair | van | transit",
    "licensePlate": "string",
    "capacity": "number",
    "wheelchairAccessible": "boolean",
    "status": "available | in-use | maintenance",
    "assignedDriver": "string | null"
  }
}
```

---

## 7. Transcripts / Call History

### GET /transcripts

Fetch past call transcripts.

**Query Parameters:**
| Parameter  | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| outcome    | string | No       | Filter: accepted, rejected, missed, transferred|
| dateFrom   | string | No       | ISO8601 date                                   |
| dateTo     | string | No       | ISO8601 date                                   |
| search     | string | No       | Search in transcript text                      |
| limit      | number | No       | Max results (default: 50)                      |
| offset     | number | No       | Pagination offset                              |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "callId": "string",
      "phone": "string",
      "phoneFormatted": "string",
      "location": {
        "city": "string",
        "state": "string",
        "country": "string",
        "region": "string",
        "display": "string",
        "isApproximate": "boolean"
      },
      "startTime": "ISO8601 datetime",
      "endTime": "ISO8601 datetime",
      "duration": "string",
      "outcome": "accepted | rejected | missed | transferred",
      "transcript": [
        {
          "role": "caller | agent | system",
          "text": "string",
          "timestamp": "string"
        }
      ]
    }
  ],
  "total": "number"
}
```

---

### GET /transcripts/{callId}

Fetch single transcript.

**Path Parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| callId    | string | Yes      | Unique call ID   |

**Response:**
```json
{
  "success": true,
  "data": {
    "callId": "string",
    "phone": "string",
    "phoneFormatted": "string",
    "location": {
      "city": "string",
      "state": "string",
      "country": "string",
      "region": "string",
      "display": "string"
    },
    "startTime": "ISO8601 datetime",
    "endTime": "ISO8601 datetime",
    "duration": "string",
    "outcome": "accepted | rejected | missed | transferred",
    "transcript": [
      {
        "role": "caller | agent | system",
        "text": "string",
        "timestamp": "string"
      }
    ]
  }
}
```

---

## 8. Statistics

### GET /stats

Fetch call center statistics.

**Query Parameters:**
| Parameter  | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| period     | string | No       | today, week, month   |

**Response:**
```json
{
  "success": true,
  "data": {
    "activeCalls": "number",
    "queueLength": "number",
    "avgWaitTime": "string",
    "tripsCreated": "number",
    "pendingAssignment": "number",
    "today": {
      "accepted": "number",
      "rejected": "number",
      "missed": "number",
      "transferred": "number",
      "avgDuration": "string",
      "totalCalls": "number",
      "conversionRate": "number",
      "tripsCreated": "number",
      "tripsAssigned": "number"
    }
  }
}
```

---

## 9. WebSocket Events (Real-time)

### Connection

```
wss://{tenant}-bridge.{domain}/callcenter/ws
```

### Events

| Event                | Direction | Description                    |
|----------------------|-----------|--------------------------------|
| `call:incoming`      | Server→Client | New call added to queue    |
| `call:answered`      | Server→Client | Call picked up by agent    |
| `call:ended`         | Server→Client | Call ended                 |
| `call:transferred`   | Server→Client | Call transferred           |
| `queue:updated`      | Server→Client | Queue position changes     |
| `transcript:message` | Server→Client | New transcript message     |
| `trip:created`       | Server→Client | New trip created           |
| `trip:assigned`      | Server→Client | Trip assigned to driver    |
| `stats:updated`      | Server→Client | Statistics refreshed       |

### Event Payload Examples

**call:incoming**
```json
{
  "event": "call:incoming",
  "data": {
    "callId": "string",
    "phone": "string",
    "queuePosition": "number",
    "location": {
      "city": "string",
      "state": "string",
      "display": "string"
    }
  }
}
```

**transcript:message**
```json
{
  "event": "transcript:message",
  "data": {
    "callId": "string",
    "message": {
      "role": "caller | agent | system",
      "text": "string",
      "timestamp": "string"
    }
  }
}
```

**trip:assigned**
```json
{
  "event": "trip:assigned",
  "data": {
    "tripId": "string",
    "driverId": "string",
    "vehicleId": "string",
    "assignedAt": "ISO8601 datetime"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "string",
  "code": "string",
  "details": {}
}
```

### Common Error Codes

| Code              | HTTP Status | Description                |
|-------------------|-------------|----------------------------|
| `UNAUTHORIZED`    | 401         | Invalid or missing token   |
| `FORBIDDEN`       | 403         | Insufficient permissions   |
| `NOT_FOUND`       | 404         | Resource not found         |
| `VALIDATION_ERROR`| 422         | Invalid request payload    |
| `SERVER_ERROR`    | 500         | Internal server error      |
