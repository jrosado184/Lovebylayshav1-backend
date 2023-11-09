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

**Description:**:
Creates a new guest user and appointment if one doesn't already exist. This process involves validating the required information within the request body and checking for the existence of a guest user. If a user already exists but hasn't booked an appointment, the system creates an appointment and adds the `appointment_id` to the guest user's appointments array but does not create another guest user.

**Example**

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

if a guest user does not exist and the appointment has not been booked, it created a guest user and appointment, while also referencing with the appropiate id's

**Required Body Parameters**:

  `first_name`
  `last_name`
  `email`
  `phone_number` 

### PUT `/api/auth/guestUsers/:id`

**Description:**:
Updates a user account. Validates required information is included in the request body and checks if id passed in params exists.

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

## User Endpoints

### GET `/api/auth/registeredUsers`

**Description:**  
Retrieves a list of all users that have been registered in the system. Access is restricted to administrators.

**Authorization:**  
Required: Admin privileges.

**Example Response:**

```json
[
  {
    "_id": "testId",
    "first_name": "testFirstName",
    "last_name": "testLastName",
    "email": "user@example.com",
    "password": "hashedPassword",
    "phone_number": "123-456-7890",
    "appointments": {
      "upcoming": [],
      "past": []
    },
    "createdAt": "2023-10-30T09:24:21.898Z",
    "updatedAt": "2023-10-30T09:24:21.898Z",
    "administrative_rights": false
  }
]
```

### GET `/api/auth/registeredUsers/:id`

**Description:**:
Retrieves a registered user by the provided ID. Includes middleware validation to ensure the user ID exists.

**Authorization**:
Required: User's ID must match the authenticated user or have admin privileges.

**Example Response**:

```json
{
  "_id": "testId",
  "first_name": "testFirstName",
  "last_name": "testLastName",
  "email": "user@example.com",
  "password": "hashedPassword",
  "phone_number": "123-456-7890",
  "appointments": {
    "upcoming": [],
    "past": []
  },
  "createdAt": "2023-10-30T09:24:21.898Z",
  "updatedAt": "2023-10-30T09:24:21.898Z",
  "administrative_rights": false
}
```

### POST `/api/auth/registeredUsers`

**Description:**:
Creates a new user account. Validates required information is included in the request body and checks if the email has any associated upcoming guest appointments.

**Required Body Parameters**:

    `first_name`
    `last_name`
    `email`
    `phone_number`
    `password`

**Behavior**:

    If a guest appointment is found, the guest account is deleted, and the appointment's user_id is updated to the new registered user's ID.

**Example Response**:

```json
{
  "_id": "testId",
  "first_name": "testFirstName",
  "last_name": "testLastName",
  "email": "user@example.com",
  "password": "hashedPassword",
  "phone_number": "123-456-7890",
  "appointments": {
    "upcoming": [],
    "past": []
  },
  "createdAt": "2023-10-30T09:24:21.898Z",
  "updatedAt": "2023-10-30T09:24:21.898Z",
  "administrative_rights": false
}
```

### PUT `/api/auth/registeredUsers/:id`

**Description:**:
Updates a user account. Validates required information is included in the request body and checks if id passed in params exists.

**Optional Body Parameters**:

    `first_name`
    `last_name`
    `email`
    `phone_number`
    `password`

**Example Response**:

```json
{
  "_id": "testId",
  "first_name": "testFirstName",
  "last_name": "testLastName",
  "email": "user@example.com",
  "password": "hashedPassword",
  "phone_number": "123-456-7890",
  "appointments": {
    "upcoming": [],
    "past": []
  },
  "createdAt": "2023-10-30T09:24:21.898Z",
  "updatedAt": "2023-10-30T09:24:21.898Z",
  "administrative_rights": false
}
```

## DELETE `/api/auth/registeredUsers/:id`

**Description:**:

Deletes user account. Validates that the id passed in the params exists. Also check if an appointment belonging to that user exists, if so, user is unable to delete account until appointment is either canceled or completed.

**Behavior**:

removes user if no upcoming appointments exist on the account and also removes active session

**Example Response**:

```json
{
  "user was successfully deleted"
}
```
