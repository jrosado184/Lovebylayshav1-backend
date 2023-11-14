## Appointments Endpoints

### GET `/api/auth/appointments`

**Description:**  
Retrieves a list of all appointments in the system. Access is restricted to administrators.

**Authorization:**  
Required: Admin privileges.

**Example Response:**

```json
[
  {
    "_id": "655120c29020c753942fc57e",
    "year": 2023,
    "month": 11,
    "day": 8,
    "time": "10:00 AM",
    "services": {
      "nails": {
        "fullSet": true,
        "shape": "coffin",
        "length": "Shorties",
        "design": "any",
        "extras": ["any"]
      },
      "pedicure": "false"
    },
    "user_id": "655120c29020c753942fc57f"
  },
  {
    "_id": "655121729020c753942fc580",
    "year": 2023,
    "month": 12,
    "day": 8,
    "time": "10:00 AM",
    "services": {
      "nails": {
        "fullSet": true,
        "shape": "coffin",
        "length": "Shorties",
        "design": "any",
        "extras": ["any"]
      },
      "pedicure": "false"
    },
    "user_id": "655120c29020c753942fc57f"
  }
]
```

### POST `/api/auth/appointments`

**Description**:
Creates a new appointment if one doesn't already exist. This process involves validating the required information within the request body.

**Example**

```json
{
  "_id": "655120c29020c753942fc57e",
  "year": 2023,
  "month": 11,
  "day": 8,
  "time": "10:00 AM",
  "services": {
    "nails": {
      "fullSet": true,
      "shape": "coffin",
      "length": "Shorties",
      "design": "any",
      "extras": ["any"]
    },
    "pedicure": "false"
  },
  "user_id": "655120c29020c753942fc57f"
}
```

**Required Body Parameters**:

`year`
`month`
`day`
`time`
`fullSet`
`shape`
`length`
`design`
`extras`
`pedicure`
`addons`
`user_id`

### PUT `/api/auth/appointments/:id`

**Description:**:
Updates an exising appointment. Validates required information is included in the request body and checks if id passed in params exists.

**Optional Body Parameters**:

`year`
`month`
`day`
`time`
`fullSet`
`shape`
`length`
`design`
`extras`
`pedicure`
`addons`

**Required Body Parameteres**
if updating an appointment, the following are required: 
`day`
`month`
`year`

**Example Response**:

```json
{
  "_id": "655299edcc2b2333f50fd909",
  "user_id": "653f76451de468fe57a02cce",
  "year": 2023,
  "month": 11,
  "day": 9,
  "time": "10:00 AM",
  "services": {
    "nails": {
      "fullSet": true,
      "shape": "coffin",
      "length": "Shorties",
      "design": "any",
      "extras": ["any"]
    },
    "pedicure": "false",
    "addons": "none"
  }
}
```
