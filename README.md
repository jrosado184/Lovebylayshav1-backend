# Lovebylayshav1-backend

# API Documentation

## Authentication Routes

## Users Routes

### `GET /api/auth/registeredUsers`

This endpoint retrieves a list of all users that have been registered in the system. Must be admin to access

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
  },
  {
    "_id": "testId2",
    "first_name": "anotherTestFirstName",
    "last_name": "anotherTestLastName",
    "email": "anotheruser@example.com",
    "password": "hashedPassword",
    "phone_number": "098-765-4321",
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

### `GET /api/auth/registeredUsers/:id`

This endpoint retrieves a registered user that matches the params id. It has a middleware that checks if a user with the id.
**Example Response:**

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
  },

```

### `POST /api/auth/registeredUsers`

This endpoint creates a new user and return it. It has a middleware that checks if the following was provided (these are required in the body request):
**first_name**
**last_name**
**email**
**phone_number**
**password**

This endpoint also checks if a user has booked an UPCOMING appointment as a guest. If so..

**The new user is created**
**The guest user that matches registed user's email is deleted**
**The appointment's user_id is uppdated to matched the newly created registered user**

**Example Response**

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
  },
```
