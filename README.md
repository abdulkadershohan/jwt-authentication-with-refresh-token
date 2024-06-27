<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)

# JWT Authentication in Nodejs and TypeScript — Refresh JWT with Cookie-based Token
This project demonstrates how to implement Refresh JSON Web Token (JWT) based authentication in a Node.js application using TypeScript.

## Features
* User registration with email and password
* User login with JWT generation
* Authentication middleware for protected routes
* TypeScript for type safety and better development experience
* MongoDB for data storage
* Express.js for RESTful API endpoints

## Requirements
* Node.js
* MongoDB
* npm or yarn
* Postman or any API testing tool


<!-- Getting Started -->

## Getting Started

Please follow the below instructions to run this project in your machine:

1. Clone this repository
   ```sh
   git clone https://github.com/abdulkadershohan wt-authentication-with-refresh-token.git
   cd jwt-authentication-with-refresh-token
   ```
2. Install dev dependencies
   ```sh
    npm install
    # or
    yarn install
   ```
3. Create a .env file in the root directory and add the following environment variables
   ```sh
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/jwt-authentication-with-refresh-token
   JWT_SECRET_AUTH_TOKEN=your_jwt_secret_auth_token
   JWT_SECRET_REFRESH_TOKEN=your_jwt_secret_refresh_token
   AUTH_TOKEN_EXPIRES_IN=1d
   REFRESH_TOKEN_EXPIRES_IN=7d
    ```
    Replace your_jwt_secret_auth_token, your_jwt_secret_refresh_token with your own secret keys. 
    ```sh

4. Start the server:
   ```sh
   npm run dev 
   # or
   yarn dev
   ```
   Your app should be available in port 3000

5. API Endpoints:

* POST /api/user/signup
    * Registers a new user. Requires `email` ,`name` and `password` in the request body.

* POST /api/user/login
    * Logs in a user. Requires `email` and `password` in the request body.

* GET /api/user
    * Returns the user profile. Requires a valid JWT in the `Authorization` header. e.g. `Bearer your_jwt_token`

* POST /api/user/refreshToken
    * Generates a new JWT using the refresh token stored in the cookie.
    * Requires a valid refresh token in the body. e.g. `{ "refreshToken": "your_refresh_token" }` and a valid JWT in the `Authorization` header e.g. `Bearer your_jwt_token`

* POST /api/user/logout
    * Logs out the user by invalidating the current JWT.



