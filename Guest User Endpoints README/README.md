## Guest User Endpoints

### GET `/api/auth/guestUsers`

**Description:**  
Retrieves a list of all guest users that have been booked an appointment in the system. Access is restricted to administrators.

**Authorization:**  
Required: Admin privileges.

**Example Response:**

```json
[
  {
    "_id": "user_id",
    "appointment_id": ["appointment_id"],
    "first_name": "test",
    "last_name": "test",
    "email": "test@example.com",
    "phone_number": 123456789
  }
]
```

### GET `/api/auth/guestUsers/:id`

**Description:**:
  Retrieves a guest user by the provided ID. Includes middleware validation to ensure the user ID exists.

**Authorization**:
  Required: User's ID must match the authenticated guest user or have admin privileges.

**Example Response**:

```json
{
  "_id": "user_id",
  "appointment_id": ["appointment_id"],
  "first_name": "test",
  "last_name": "test",
  "email": "test@example.com",
  "phone_number": 123456789
}
```

### POST `/api/auth/guestUsers`

**Description**:
Creates a new guest user and appointment if one doesn't already exist. This process involves validating the required information within the request body and checking for the existence of a guest user. If a user already exists but hasn't booked an appointment, the system creates an appointment and adds the `appointment_id` to the guest user's appointments array but does not create another guest user.

**Example**

```json
{
    "guestUser": {
        "_id": "655120c29020c753942fc57f",
        "appointment_id": [
            "655120c29020c753942fc57e"
        ],
        "first_name": "Javier",
        "last_name": "Rosado",
        "email": "test@example.com",
        "phone_number": 123456789
    },
    "guestUserAppointment": {
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
                "extras": [
                    "any"
                ]
            },
            "pedicure": "false"
        },
        "user_id": "655120c29020c753942fc57f"
    }
}
```

if a guest user does not exist and the appointment has not been booked, it created a guest user and appointment, while also referencing with the appropiate id's

**Required Body Parameters**:

  `first_name`
  `last_name`
  `email`
  `phone_number` 

### PUT `/api/auth/guestUsers/:id`

**Description:**:
Updates a guest user account. Validates required information is included in the request body and checks if id passed in params exists.

**Optional Body Parameters**:

    
  `first_name`
  `last_name`
  `email`
  `phone_number` 
  `password`

**Example Response**:

```json
{
  "_id": "user_id",
  "appointment_id": ["appointment_id"],
  "first_name": "test",
  "last_name": "test",
  "email": "test@example.com",
  "phone_number": 123456789
}
```

