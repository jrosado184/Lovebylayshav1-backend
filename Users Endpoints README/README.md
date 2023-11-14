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

