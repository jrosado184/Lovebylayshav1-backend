## Authentication Endpoints

### POST `/login`

**Description:**  
Allows a user that has a registered account to log in.

**Required Body Parameters**

`email`
`password`

**Example Response:**

```json
{
  "_id": "user_id",
  "first_name": "test",
  "last_name": "test",
  "email": "test@example.com",
  "phone_number": 123456789,
  "appointments": {
    "upcoming": [],
    "past": []
  },
  "createdAt": "2023-11-15T21:22:17.059Z",
  "updatedAt": "2023-11-15T21:22:17.059Z",
  "administrative_rights": false
}
```

### GET `/logout`

**Description:**  
Logs a user out from their account and destroys their session.

**Example Response:**

```json
{
  "message": "Logout and session destruction successful"
}
```

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

if a guest user does not exist and the appointment has not been booked, it created a guest user and appointment, while also referencing with the appropiate id's

**Required Body Parameters**:

`first_name`
`last_name`
`email`
`phone_number`
`service`

**Example**

```json
{
  "_id": "655120c29020c753942fc57f",
  "first_name": "Javier",
  "last_name": "Rosado",
  "email": "test@example.com",
  "phone_number": 123456789,
  "year": 2023,
  "month": 11,
  "day": 8,
  "time": "10:00 AM",
  "service": "Full Set",
  "shape": "coffin",
  "length": "Shorties",
  "design": "any",
  "extras": ["any"],
  "pedicure": "Simple Pedicure",
  "inspirations": []
}
```

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
    "avatar": "image url",
    "appointments": {
      "upcoming": [],
      "past": []
    },
    "createdAt": "2023-10-30T09:24:21.898Z",
    "updatedAt": "2023-10-30T09:24:21.898Z",
    "role": "user"
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
    "service": "Refill",
    "shape": "coffin",
    "length": "Shorties",
    "design": "any",
    "extras": ["any"],
    "pedicure": "false",
    "inspirations": []
  },
  {
    "_id": "655120c29020c753942fc57e",
    "year": 2023,
    "month": 11,
    "day": 8,
    "time": "10:00 AM",
    "service": "Refill",
    "shape": "coffin",
    "length": "Shorties",
    "design": "any",
    "extras": ["any"],
    "pedicure": "false",
    "inspirations": []
  }
]
```

### POST `/api/auth/appointments`

**Description**:
Creates a new appointment if one doesn't already exist. This process involves validating the required information within the request body.

**Required Body Parameters**:

- `year` (number): The year of the appointment.
- `month` (number): The month of the appointment.
- `day` (number): The day of the appointment.
- `time` (string): The time of the appointment.
- `fullSet` (boolean): Indicates if a full nail set is requested.
- `shape` (string): The shape of the nails.
- `length` (string): The length of the nails.
- `design` (string): The design of the nails.
- `extras` (array of strings): Extra services, if any.
- `pedicure` (boolean): Indicates if a pedicure is requested.
- `user_id` (string): The ID of the user associated with the appointment.


**Example Request**:

```json
{
  "year": 2023,
  "month": 11,
  "day": 8,
  "time": "10:00 AM",
  "service": "Refill",
  "shape": "coffin",
  "length": "Shorties",
  "design": "any",
  "extras": ["any"],
  "pedicure": false,
  "inspirations": [],
  "user_id": "655120c29020c753942fc57f",
  "createdAt": "Sun Aug 18 2024 14:57:02 GMT-0400 (Eastern Daylight Time)",
  "updatedAt": "Sun Aug 18 2024 14:57:02 GMT-0400 (Eastern Daylight Time)"
}
```

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

**Required Body Parameteres**
if updating an appointment:
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
  "service": "Refill",
  "shape": "coffin",
  "length": "Shorties",
  "design": "any",
  "extras": ["any"],
  "pedicure": "Simple Pedicure",
  "inspirations": []
}
```
### DELETE /api/auth/appointments/:id

**Description:**
Deletes an appointment based on the provided ID. The endpoint includes middleware that checks the validity of the ID and handles specific cases for guest users.

**Middleware Sequence:**

	1.	checkIfIdExists: Validates that the appointment ID exists in the system. If the ID is not found, an error is returned.
	2.	removeGuestUserIfOnlyOneAppointmentExists: If the appointment belongs to a guest user and it’s their only appointment, this middleware will also remove the guest user from the system.

  `DELETE /api/auth/appointments/12345`

``` json
 {
  "message": "appointment successfully deleted"
}
```

**Error Handling:**

	•	If the appointment ID does not exist, a 404 Not Found error may be returned.
	•	If there’s a server-side error during the deletion process, a 500 Internal Server Error response will be generated with details of the error.
