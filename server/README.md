# Server

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node](https://nodejs.org/en/)

# API

- [General](#general)
  - [Health Check - `GET /api/alive`](#health-check)
- [Authentication](#authentication)
  - [Sign Up - `POST /api/auth/signup`](#sign-up)
  - [Sign In With Email - `POST /api/auth/signin`](#sign-in-with-email)
  - [Sign In With Facebook - `POST /api/auth/facebook`](#sign-in-with-facebook)
  - [Sign In With Google - `POST /api/auth/google`](#sign-in-with-google)
  - [Send Verification Email - `POST /api/auth/send-token`](#send-verification-email)
  - [Verify Email Code - `POST /api/auth/verify-email/:token`](#verify-email-code)
  - [Send Password Reset Email - `POST /api/auth/send-token`](#send-password-reset-email)
  - [Confirm Password Reset - `POST /api/auth/password-reset/:token`](#confirm-password-reset)
  - [Refresh JWT Token - `POST /api/auth/refresh-token`](#refresh-jwt-token)
- [Profile](#profile)
  - [Get User Profile - `GET /api/profiles`](#get-user-profile)
  - [Get User Public Profile - `GET /api/profiles/:userId`](#get-user-public-profile)
  - [Update User Profile - `PUT /api/profiles`](#update-user-profile)
- [Users](#users)
  - [Get Users - `GET /api/users`](#get-users)
  - [Get User - `GET /api/users/:userId`](#get-user)
  - [Update User - `PUT /api/users/:userId`](#update-user)
  - [Delete User - `DELETE /api/users/:userId`](#delete-user)

## General

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
  "username": "user",
  "email": "user@tdev.app",
  "password": "password",
  "firstName": "User",
  "lastName": "Account"
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

### Sign In With Email

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
  "email": "user@tdev.app",
  "password": "password"
}
```

- **Response Payload**

| Property Name | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `token`       | _string_ | JWT token                 |
| `expiresAt`   | _number_ | Expires at time (seconds) |
| `user`        | _object_ | User info                 |

Sample response

```
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjMiLCJ1c2VySWQiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjIiLCJpYXQiOjE1ODE4MDk2ODYsImV4cCI6MTU4Njk5MzY4Nn0.6rjee9HpGVP-IsKfGBAiqU8Y6FHuuBN25odKZExig7liOhJd2lq_eUn8JUOtz7QpRX5RvGYzbzlxdRED0boNVA",
  "expiresAt": 1586993686,
  "signedInWith": "local",
  "user": {
    "_id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "debug": false
    },
    "provider": {
      "local": {
        "userId": "5e47a9600cac851790f29662"
      }
    },
    "createdAt": "2020-02-15T08:18:40.429Z",
    "updatedAt": "2020-02-15T08:18:40.429Z"
  }
}
```

### Sign In With Facebook

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/facebook
```

- **Resquest Body Payload**

| Property Name   | Type     | Required | Description                |
| --------------- | -------- | -------- | -------------------------- |
| `access_token`  | _string_ | Yes      | The Facebook access token  |
| `refresh_token` | _string_ | No       | The Facebook refresh token |

Sample request body payload

```
{
  "access_token": "EAAx0076n7rwBAE76vGbLS0y5kK01uZB7urxtWC1eh30NIZBO4G0XH1gA2CSRGtNFxaZBKiUlT0nZAPk8AzyiK1DGg47HOaWnkfaG4FyZCPhiEQZByPbP9dWB6JZBw6GiIXPGmnSdkIAzuT5MEK5slyAEs8jZCazvs4wziZBdx2eIsWeSN5Hhxy9RRrZCSHrWGm8hvI9DrxZCkeR4BWVxLN6YItOuZC1A80VctLAZD"
}
```

- **Response Payload**

| Property Name  | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `token`        | _string_ | JWT token                                            |
| `expiresAt`    | _number_ | Expires at time (seconds)                            |
| `signedInWith` | _string_ | The auth provider that the user used to sign in with |
| `user`         | _object_ | User info                                            |

Sample response

```
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjMiLCJ1c2VySWQiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjIiLCJpYXQiOjE1ODE4MDk2ODYsImV4cCI6MTU4Njk5MzY4Nn0.6rjee9HpGVP-IsKfGBAiqU8Y6FHuuBN25odKZExig7liOhJd2lq_eUn8JUOtz7QpRX5RvGYzbzlxdRED0boNVA",
  "expiresAt": 1586993686,
  "signedInWith": "facebook",
  "user": {
    "_id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "debug": false
    },
    "provider": {
      "facebook": {
        "userId": "197154714957030",
        "picture": "picture-url.jpg"
      }
    },
    "createdAt": "2020-02-15T08:18:40.429Z",
    "updatedAt": "2020-02-15T08:18:40.429Z"
  }
}
```

### Sign In With Google

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/google
```

- **Resquest Body Payload**

| Property Name   | Type     | Required | Description              |
| --------------- | -------- | -------- | ------------------------ |
| `access_token`  | _string_ | Yes      | The Google access token  |
| `refresh_token` | _string_ | No       | The Google refresh token |

Sample request body payload

```
{
  "access_token": "ya29.ImC_B0mUYTJfjnd7fCgZvIc6WWjj3GxMC0LwiOyhqDIQBJyAJN9eSRCLNDcr6bXCtHn5oSNOsB-Es2AIIOso-ZMBe0w31K2Ud85dpq3ep4tZI6uftTq_Vjjnzf4esuVO73c"
}
```

- **Response Payload**

| Property Name  | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `token`        | _string_ | JWT token                                            |
| `expiresAt`    | _number_ | Expires at time (seconds)                            |
| `signedInWith` | _string_ | The auth provider that the user used to sign in with |
| `user`         | _object_ | User info                                            |

Sample response

```
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjMiLCJ1c2VySWQiOiI1ZTQ3YTk2MDBjYWM4NTE3OTBmMjk2NjIiLCJpYXQiOjE1ODE4MDk2ODYsImV4cCI6MTU4Njk5MzY4Nn0.6rjee9HpGVP-IsKfGBAiqU8Y6FHuuBN25odKZExig7liOhJd2lq_eUn8JUOtz7QpRX5RvGYzbzlxdRED0boNVA",
  "expiresAt": 1586993686,
  "signedInWith": "google",
  "user": {
    "_id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "debug": false
    },
    "provider": {
      "google": {
        "userId": "114383861774342288272",
        "picture": "picture-url.jpg"
      }
    },
    "createdAt": "2020-02-15T08:18:40.429Z",
    "updatedAt": "2020-02-15T08:18:40.429Z"
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
  "email": "user@tdev.app",
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
  "email": "user@tdev.app",
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
  "email": "user@tdev.app",
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

### Refresh JWT Token

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/auth/refresh-token
```

- **Response payload**

| Property Name | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `token`       | _string_ | New JWT token             |
| `expiresAt`   | _number_ | Expires at time (seconds) |

Sample response

```
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTI3ZTQ4OTY2OGEyYjQxZWUxNmY3NDIiLCJ1c2VySWQiOiI1ZTI0ZjhkM2M1ZGZmZjFmYzk1NDQ3ZDUiLCJpYXQiOjE1Nzk2NzY1OTgsImV4cCI6MTU4NDg2MDU5OH0.7DjINccJtzowF0Nf2DnMoBtKpWEzRKLqcpzzIByHuwnqXRHKduYHGfOgf1ak9t2qLHQzPwMw-FxOGtZGVvAucA",
  "expiresAt": 1584860598,
}
```

## Profile

### Get User Profile

- **Method:** `GET`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/profiles
```

- **Response payload**

| Property Name | Type     | Description              |
| ------------- | -------- | ------------------------ |
| `profile`     | _object_ | User profile JSON object |

Sample response

```
{
  "profile": {
    "_id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "debug": false
    },
    "provider": {
      "local": {
        "userId": "5e47a9600cac851790f29662"
      }
    },
    "createdAt": "2020-02-15T08:18:40.429Z",
    "updatedAt": "2020-02-15T08:18:40.429Z"
  }
}
```

### Get User Public Profile

- **Method:** `GET`
- **Content-Type:** `application/json`

- **Endpoint**

```
/api/profiles/:userId
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
    "username": "sarah",
    "firstName": "Sarah",
    "lastName": "Connor",
    "createdAt": "2020-01-19T22:11:56.779Z"
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
/api/profiles
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

- **Resquest Query**

| Property Name | Type     | Required | Description                                                    |
| ------------- | -------- | -------- | -------------------------------------------------------------- |
| `limit`       | _number_ | No       | Limit number (Default: 30)                                     |
| `skip`        | _number_ | No       | Offset number (Default: 0)                                     |
| `sort`        | _string_ | No       | Sort criteria (example: "createdAt" or "-createdAt")           |
| `username`    | _string_ | No       | Username                                                       |
| `email`       | _string_ | No       | Email                                                          |
| `firstName`   | _string_ | No       | First name                                                     |
| `lastName`    | _string_ | No       | Last name                                                      |
| `status`      | _string_ | No       | Status. It could be "active", "disabled" or "unverifiedEmail"] |
| `role`        | _string_ | No       | User role. It could be "root", "admin" or "user"               |
| `permissions` | _string_ | No       | User permissions. (example: 'readPosts' or 'editPosts').       |

Note: When permissions is specified (without role), it will include admin and root users in the response.

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
      "role": "root",
      "permissions": {
        "debug": false
      },
      "provider": {
        "local": {
          "userId": "5e24d42cf7dddf012cd496b2"
        }
      },
      "createdAt": "2020-01-19T22:11:56.779Z",
      "updatedAt": "2020-01-19T23:18:47.897Z"
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
      },
      "provider": {
        "local": {
          "userId": "5e24db1d560ba309f0b0b5a8"
        }
      },
      "createdAt": "2020-01-20T20:44:44.634Z",
      "updatedAt": "2020-01-22T01:28:03.783Z"
    }
  ],
  "usersCount": 2
}
```

### Get User

- **Method:** `GET`
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

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `user`        | _object_ | User info   |

Sample response

```
{
  "user": {
    "_id": "5e24d42cf7dddf012cd496b2",
    "username": "tester",
    "email": "test@test.com",
    "status": "active",
    "firstName": "Sarah",
    "lastName": "Connor",
    "role": "root",
    "permissions": {
      "debug": false
    },
    "provider": {
      "local": {
        "userId": "5e24d42cf7dddf012cd496b2"
      }
    },
    "createdAt": "2020-01-19T22:11:56.779Z",
    "updatedAt": "2020-01-19T23:18:47.897Z"
  }
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
| `status`      | _string_ | No       | New status. It could be "active", "disabled" or "unverifiedEmail"                    |
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
