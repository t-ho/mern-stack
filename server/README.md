# Server

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node](https://nodejs.org/en/)

# API

### Health Check

- **Method:** `GET`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/alive
```

- **Response payload**

| Property Name | Type     | Description    |
| ------------- | -------- | -------------- |
| `status`      | _string_ | Service status |

Sample response

```
{
  "status": "pass"
}
```

## Authentication

### Sign Up

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/signup
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description |
| ------------- | -------- | -------- | ----------- |
| `username`    | _string_ | Yes      | Username    |
| `email`       | _string_ | Yes      | Email       |
| `password`    | _string_ | Yes      | Password    |
| `firstName`   | _string_ | No       | First name  |
| `lastName`    | _string_ | No       | Last name   |

Sample request body payload

```
{
  "username": "tester",
  "email": "test@test.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Connor"
}
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  "success": true,
  "message": "Your account has been created successfully"
}
```

### Sign In

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/signin
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description                          |
| ------------- | -------- | -------- | ------------------------------------ |
| `username`    | _string_ | Yes      | Either username or email is required |
| `email`       | _string_ | Yes      | Either username or email is required |
| `password`    | _string_ | Yes      | Password                             |

Sample request body payload

```
{
  "email": "test@test.com",
  "password": "password"
}
```

- **Response Payload**

| Property Name | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `token`       | _string_ | JWT token                 |
| `expiresAt`   | _string_ | Expires at time (seconds) |
| `user`        | _object_ | User info                 |

Sample response

```
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTI0ZDQyY2Y3ZGRkZjAxMmNkNDk2YjIiLCJ1c2VySWQiOiI1ZTI0ZDQyY2Y3ZGRkZjAxMmNkNDk2YjIiLCJpYXQiOjE1Nzk0NzI1OTMsImV4cCI6MTU4NDY1NjU5M30.nlrURWeYjMr9cBXa-QhWCQVyKw2tPsQjnUyPaXnitMv9PxcOUjZJzn4U-mN4o_Eg8d9IqTP2_WJjmiAU5QydPA",
  expiresAt: 1584656593,
  "user": {
    "_id": "5e24d42cf7dddf012cd496b2",
    "username": "tester",
    "email": "test@test.com",
    "status": "active",
    "firstName": "John",
    "lastName": "Connor",
    "role": "user",
    "permissions": {
      "debug": false
    }
  }
}
```

### Send Verification Email

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/send-token
```

- **Resquest Body Payload**

| Property Name  | Type     | Required | Description                             |
| -------------- | -------- | -------- | --------------------------------------- |
| `email`        | _string_ | Yes      | Email                                   |
| `tokenPurpose` | _string_ | Yes      | Token purpose. It must be `verifyEmail` |

Sample request body payload

```
{
  "email": "test@test.com",
  "tokenPurpose": "verifyEmail",
}
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  "success": true,
  "message": "A verification email has been sent to your email"
}
```

### Verify Email Code

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/verify-email/:token
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  "success": true,
  "message": "Email verified"
}
```

### Send Password Reset Email

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/send-token
```

- **Resquest Body Payload**

| Property Name  | Type     | Required | Description                               |
| -------------- | -------- | -------- | ----------------------------------------- |
| `email`        | _string_ | Yes      | Email                                     |
| `tokenPurpose` | _string_ | Yes      | Token purpose. It must be `resetPassword` |

Sample request body payload

```
{
  "email": "test@test.com",
  "tokenPurpose": "resetPassword",
}
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  {
    "success": true,
    "message": "A password-reset email has been sent to your email"
  }
}
```

### Confirm Password Reset

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/reset-password/:token
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description  |
| ------------- | -------- | -------- | ------------ |
| `email`       | _string_ | Yes      | Email        |
| `password`    | _string_ | Yes      | New password |

Sample request body payload

```
{
  "email": "test@test.com",
  "password: "new-password"
}
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  "success": true,
  "message": "Password reset"
}
```

### Get User Profile

- **Method:** `GET`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/auth/profile
```

- **Response payload**

| Property Name | Type     | Description              |
| ------------- | -------- | ------------------------ |
| `profile`     | _object_ | User profile JSON object |

Sample response

```
{
  "profile": {
    "_id": "5e24d42cf7dddf012cd496b2",
    "username": "tester",
    "email": "test@test.com",
    "status": "active",
    "firstName": "John",
    "lastName": "Connor",
    "role": "user",
    "permissions": {
      "debug": false
    }
  }
}
```

### Update User Profile

- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/auth/profile
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description    |
| ------------- | -------- | -------- | -------------- |
| `password`    | _string_ | No       | New password   |
| `firstName`   | _string_ | No       | New first name |
| `lastName`    | _string_ | No       | New last name  |

Sample request body payload

```
{
  "password: "new-password",
  "firstName: "Sarah"
}
```

- **Response payload**

| Property Name   | Type           | Description             |
| --------------- | -------------- | ----------------------- |
| `success`       | _boolean_      | Status                  |
| `updatedFields` | _string array_ | Fields has been updated |

Sample response

```
{
  "success": true,
  "updatedFields": [
    "password",
    "firstName"
  ]
}
```

## Users

### Get Users

- **Method:** `GET`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/users
```

- **Response Payload**

| Property Name | Type           | Description             |
| ------------- | -------------- | ----------------------- |
| `users`       | _object array_ | A list of users         |
| `usersCount`  | _number_       | A total number of users |

Sample response

```
{
  "users": [
    {
      "_id": "5e24d42cf7dddf012cd496b2",
      "username": "tester",
      "email": "test@test.com",
      "status": "active",
      "firstName": "Sarah",
      "lastName": "Connor",
      "role": "admin",
      "permissions": {
        "debug": false
      }
    },
    {
      "_id": "5e24db1d560ba309f0b0b5a8",
      "username": "tester2",
      "email": "test2@test.com",
      "status": "active",
      "firstName": "John",
      "lastName": "Connor",
      "role": "user",
      "permissions": {
        "debug": false
      }
    }
  ],
  "usersCount": 2
}
```

### Update User

- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/users/:userId
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description                                                                          |
| ------------- | -------- | -------- | ------------------------------------------------------------------------------------ |
| `role`        | _string_ | No       | New role. It could be "admin" or "user". NOTE: Only root users can update user role. |
| `status`      | _string_ | No       | New status. It could be "active" or "unverifiedEmail"                                |
| `permissions` | _object_ | No       | Permissions object                                                                   |

Sample request body payload

```
{
  "role": "admin",
  "permissions": {
    "debug": true
  }
}
```

- **Response Payload**

| Property Name   | Type           | Description             |
| --------------- | -------------- | ----------------------- |
| `success`       | _boolean_      | Status                  |
| `updatedFields` | _string array_ | Fields has been updated |

Sample response

```
{
  "success": true,
  "updatedFields": [
    "role",
    "permissions"
  ]
}
```

### Delete User

- **Method:** `DELETE`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/users/:userId
```

- **Response Payload**

| Property Name | Type      | Description |
| ------------- | --------- | ----------- |
| `success`     | _boolean_ | Status      |
| `message`     | _string_  | Message     |

Sample response

```
{
  "success": true,
  "message": "User deleted"
}
```
