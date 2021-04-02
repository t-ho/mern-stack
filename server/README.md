[![CI Testing](https://github.com/t-ho/mern-stack/workflows/CI%20Testing/badge.svg?branch=master)](https://github.com/t-ho/mern-stack/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/t-ho/mern-stack)](https://github.com/t-ho/mern-stack/blob/master/LICENSE)

<p align="center"><a href="https://github.com/t-ho/mern-stack"><img alt="mern-logo" width="360" src="https://raw.githubusercontent.com/t-ho/mern-stack/assets/assets/mern-logo.png"/></a></p>

# API

- [General](#general)
  - [Health Check - `GET /api/alive`](#health-check)
- [Authentication](#authentication)
  - [Sign Up - `POST /api/auth/signup`](#sign-up)
  - [Sign In With Email - `POST /api/auth/signin`](#sign-in-with-email)
  - [Sign In With Apple - `POST /api/auth/apple`](#sign-in-with-apple)
  - [Sign In With Facebook - `POST /api/auth/facebook`](#sign-in-with-facebook)
  - [Sign In With Google - `POST /api/auth/google`](#sign-in-with-google)
  - [Send Verification Email - `POST /api/auth/send-token`](#send-verification-email)
  - [Verify Email Code - `POST /api/auth/verify-email/:token`](#verify-email-code)
  - [Send Password Reset Email - `POST /api/auth/send-token`](#send-password-reset-email)
  - [Confirm Password Reset - `POST /api/auth/password-reset/:token`](#confirm-password-reset)
  - [Invalidate All JWT Tokens - `POST /api/auth/invalidate-all-jwt-tokens`](#invalidate-all-jwt-tokens)
  - [Verify JWT Token - `POST /api/auth/verify-jwt-token`](#verify-jwt-token)
- [Profile](#profile)
  - [Get User Profile - `GET /api/profiles`](#get-user-profile)
  - [Get User Public Profile - `GET /api/profiles/:userId`](#get-user-public-profile)
  - [Update User Profile - `PUT /api/profiles`](#update-user-profile)
  - [Update Password - `PUT /api/profiles/password`](#update-password)
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

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
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
    "id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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

### Sign In With Apple

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint**

```
/api/auth/apple
```

- **Resquest Body Payload**

| Property Name | Type     | Required | Description                  |
| ------------- | -------- | -------- | ---------------------------- |
| `code`        | _string_ | Yes      | The Apple authorization code |
| `user`        | _string_ | No       | The user object              |

Sample request body payload

```
{
  "code": "c99a498c3274c4536b25fa497ab843fd6.0.srqwv.j5XSP_uk87Et1xsKlMUEFw",
  "user: {
    "name": {
      "firstName": "User",
      "lastName": "Account"
    }
  }
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
  "signedInWith": "apple",
  "user": {
    "id": "5e47a9600cac851790f29662",
    "username": "sn824b2zsd",
    "email": "sn824b2zsd@privaterelay.appleid.com",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
    },
    "provider": {
      "apple": {
        "userId": "001765.bfe650a68ab3407caf263826e4fac791.2416",
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

| Property Name  | Type     | Required | Description                |
| -------------- | -------- | -------- | -------------------------- |
| `accessToken`  | _string_ | Yes      | The Facebook access token  |
| `refreshToken` | _string_ | No       | The Facebook refresh token |

Sample request body payload

```
{
  "accessToken": "EAAx0076n7rwBAE76vGbLS0y5kK01uZB7urxtWC1eh30NIZBO4G0XH1gA2CSRGtNFxaZBKiUlT0nZAPk8AzyiK1DGg47HOaWnkfaG4FyZCPhiEQZByPbP9dWB6JZBw6GiIXPGmnSdkIAzuT5MEK5slyAEs8jZCazvs4wziZBdx2eIsWeSN5Hhxy9RRrZCSHrWGm8hvI9DrxZCkeR4BWVxLN6YItOuZC1A80VctLAZD"
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
    "id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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

| Property Name | Type     | Required | Description         |
| ------------- | -------- | -------- | ------------------- |
| `idToken`     | _string_ | Yes      | The Google ID token |

Sample request body payload

```
{
  "idToken": "eyJhbGciOiJSUzI1NiksImtpZCI6ImYwOTJiNjEyZTliNjQ0N2RlYjEwNjg1YmI4ZmZhOGFlNjJmNmFhOTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMzQ2NzUwNjIwMDMtbHRhbDY2cGo3bHR0NHF1ZW9rdjdkbjg4b3E4cHZmbjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5Yb20iLCJhdWQiOiIxMzQ2NzUwNjIwMDMtdM5nZmZvazNuOGV1ZjUzczlxcWZsOWt1c3BqaDRggGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgwMzQyNzQ2NzMzMTk2NDI2NjIiLCJlbWFpbCI6InRlc3Rlci5obXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJOMDRZdFNZZVl5WUoycS1VNUhZTmlnIiwibm9uY2UiOiJOenlrbW9rNnZZVzAzUURHZ2UyLXVSREozaEJoUTljSm5qX0pyRXdLRlNFIiwibmFtZSI6InQgaG8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2h0ck8zOHF4bFM5R1ZqUHdXVEdhSVlZZ0lIYUtKVVlxY3F1Z1JsPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6InQiLCJmYW1pbHlfbmFtZSI6ImhvIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MDUwODY2NDIsImV4cCI6MTYwNTA5MDI0Mn0.142V5YJdBaoR_jPK7-g87cgLFFkFWxu1fbxEXRh8HHQLveCmiMgb9XvoZyxpe6hthNUAyzB4Jtq-ijgzwaEY6W4OLr3sczngi9SluqmM2YORLa0p6PIPgJKr-e3rJjIQBgM_4Ye-p8fAl8YzZyHduPzT7gS2Xie5HUZ9BHOh4jtPpKx6z1goE4Ev9apdyCVt6XbVzN5gsBHEHM3YQAU0KN4WbJzEvYSkaTjoRAGE3_naaTzv5EvyiR08n5lB9Y37LMEJeohf_SMCpaXsyWkzduf2aP2Rb-KUH_EkJXsYZVuDr9lP5FzGUDgbeeyv08HThYGEOPuwAEfKSRVbcOH3mw"
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
    "id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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

| Property Name  | Type     | Required | Description                              |
| -------------- | -------- | -------- | ---------------------------------------- |
| `email`        | _string_ | Yes      | Email                                    |
| `tokenPurpose` | _string_ | Yes      | Token purpose. It must be `verify-email` |

Sample request body payload

```
{
  "email": "user@tdev.app",
  "tokenPurpose": "verify-email",
}
```

- **Response Payload**

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
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

- **Resquest Body Payload**

| Property Name | Type     | Required | Description          |
| ------------- | -------- | -------- | -------------------- |
| `password`    | _string_ | Yes      | The current password |

Sample request body payload

```
{
  "password": "password"
}
```

- **Response Payload**

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
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

| Property Name  | Type     | Required | Description                                |
| -------------- | -------- | -------- | ------------------------------------------ |
| `email`        | _string_ | Yes      | Email                                      |
| `tokenPurpose` | _string_ | Yes      | Token purpose. It must be `reset-password` |

Sample request body payload

```
{
  "email": "user@tdev.app",
  "tokenPurpose": "reset-password",
}
```

- **Response Payload**

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
  {
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

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
  "message": "Password reset"
}
```

### Invalidate All JWT Tokens

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/auth/invalidate-all-jwt-tokens
```

- **Resquest Body Payload**

No payload required

- **Response payload**

| Property Name | Type     | Description             |
| ------------- | -------- | ----------------------- |
| `message`     | _string_ | The verification status |

Sample response

```
{
  "message": "All JWT tokens have been invalidated",
}
```

### Verify JWT Token

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/auth/verify-jwt-token
```

- **Resquest Body Payload**

| Property Name  | Type      | Required | Description                                                 |
| -------------- | --------- | -------- | ----------------------------------------------------------- |
| `refreshToken` | _boolean_ | No       | If `true`, a new JWT token will be included in the response |
| `refreshUser`  | _boolean_ | No       | If `true`, an user object will be included in the response  |

Sample request body payload

```
{
  "refreshToken": true,
}
```

- **Response payload**

| Property Name | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `message`     | _string_ | The verification status   |
| `token`       | _string_ | New JWT token             |
| `expiresAt`   | _number_ | Expires at time (seconds) |

Sample response

```
{
  "message": "JWT token is valid",
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
    "id": "5e47a9600cac851790f29662",
    "username": "user",
    "email": "user@tdev.app",
    "status": "active",
    "firstName": "User",
    "lastName": "Account",
    "role": "user",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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
    "id": "5e24d42cf7dddf012cd496b2",
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
| `firstName`   | _string_ | No       | New first name |
| `lastName`    | _string_ | No       | New last name  |

Sample request body payload

```
{
  "firstName: "Sarah"
}
```

- **Response payload**

| Property Name   | Type           | Description             |
| --------------- | -------------- | ----------------------- |
| `user`          | _object_       | The updated user object |
| `updatedFields` | _string array_ | Fields has been updated |

Sample response

```
{
  "user": {
    "id": "5ed72abbdbc55ffdf6d221c3",
    "username": "root",
    "email": "root@tdev.app",
    "status": "active",
    "firstName": "Sarah",
    "lastName": "Account",
    "role": "root",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false
    },
    "provider": {
      "local": {
        "userId": "5ed72abbdbc55ffdf6d221c3"
      }
    },
    "createdAt": "2020-06-03T04:44:43.980Z",
    "updatedAt": "2020-10-16T18:37:12.632Z"
  },
  "updatedFields": [
    "firstName"
  ]
}
```

### Update Password

- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authentication Header**

```
Authorization: Bearer {JWT Token}
```

- **Endpoint**

```
/api/profiles/password
```

- **Resquest Body Payload**

| Property Name     | Type     | Required | Description      |
| ----------------- | -------- | -------- | ---------------- |
| `currentPassword` | _string_ | Yes      | Current password |
| `password`        | _string_ | Yes      | New password     |

Sample request body payload

```
{
  "currentPassword: "current-password",
  "password: "new-password",
}
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

| Property Name | Type     | Required | Description                                                     |
| ------------- | -------- | -------- | --------------------------------------------------------------- |
| `limit`       | _number_ | No       | Limit number (Default: 30)                                      |
| `skip`        | _number_ | No       | Offset number (Default: 0)                                      |
| `sort`        | _string_ | No       | Sort criteria (example: "createdAt" or "-createdAt")            |
| `username`    | _string_ | No       | Username                                                        |
| `email`       | _string_ | No       | Email                                                           |
| `firstName`   | _string_ | No       | First name                                                      |
| `lastName`    | _string_ | No       | Last name                                                       |
| `status`      | _string_ | No       | Status. It could be "active", "disabled" or "unverified-email"] |
| `role`        | _string_ | No       | User role. It could be "root", "admin" or "user"                |
| `permissions` | _string_ | No       | User permissions. (example: 'readPosts' or 'editPosts').        |

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
      "id": "5e24d42cf7dddf012cd496b2",
      "username": "tester",
      "email": "test@test.com",
      "status": "active",
      "firstName": "Sarah",
      "lastName": "Connor",
      "role": "root",
      "permissions": {
        "userInsert": false,
        "userModify": false,
        "userRead": false,
        "postInsert": false,
        "postModify": false,
        "postRead": true
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
      "id": "5e24db1d560ba309f0b0b5a8",
      "username": "tester2",
      "email": "test2@test.com",
      "status": "active",
      "firstName": "John",
      "lastName": "Connor",
      "role": "user",
      "permissions": {
        "userInsert": false,
        "userModify": false,
        "userRead": false,
        "postInsert": false,
        "postModify": false,
        "postRead": true
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
    "id": "5e24d42cf7dddf012cd496b2",
    "username": "tester",
    "email": "test@test.com",
    "status": "active",
    "firstName": "Sarah",
    "lastName": "Connor",
    "role": "root",
    "permissions": {
      "userInsert": false,
      "userModify": false,
      "userRead": false,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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
| `status`      | _string_ | No       | New status. It could be "active", "disabled" or "unverified-email"                   |
| `permissions` | _object_ | No       | Permissions object                                                                   |

Sample request body payload

```
{
  "role": "admin",
  "permissions": {
    "userInsert": true,
    "userModify": true,
    "userRead": true,
    "postInsert": false,
    "postModify": false,
    "postRead": true
  }
}
```

- **Response Payload**

| Property Name   | Type           | Description             |
| --------------- | -------------- | ----------------------- |
| `updatedFields` | _string array_ | Fields has been updated |
| `user`          | _object_       | Updated user info       |

Sample response

```
{
  "updatedFields": [
    "role",
    "permissions"
  ],
  "user": {
    "id": "5e24d42cf7dddf012cd496b2",
    "username": "tester",
    "email": "test@test.com",
    "status": "active",
    "firstName": "Sarah",
    "lastName": "Connor",
    "role": "admin",
    "permissions": {
      "userInsert": true,
      "userModify": true,
      "userRead": true,
      "postInsert": false,
      "postModify": false,
      "postRead": true
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

| Property Name | Type     | Description |
| ------------- | -------- | ----------- |
| `message`     | _string_ | Message     |

Sample response

```
{
  "message": "User deleted."
}
```
