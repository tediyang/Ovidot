# Ovidot API Backend
Ovidot is a web application that aims to revolutionize women's health tracking by offering cycle predictions, fertility insights, and comprehensive health guidance. This documentation provides steps how to setup the API service and make CRUD requests.

## Features
* Dashboard Account Registration, Login, and Sign Out
* Menstraution Range Prediction
* Ovulation Range Prediction And Ovulation Date Prediction
* Ovulation Date Update
* Unsafe Days Range Prediction
* Next Cycle Date Prediction
* Cycle Storage
* Registered Users can view past Cycles

## Tech
* [Node Js](https://nodejs.org/en)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Express Js](http://expressjs.com/)
* [Js Doc](https://github.com/jsdoc/jsdoc)

## Installation
Clone repository from github in your OS terminal
```bash
User@User ~
$ git clone https://github.com/Tediyang/ovidot.git
```

Change directory to the project directory
```bash
User@User ~ 
$ cd ovidot/backend
```

Change branch from master to development
```bash
User@User ~/ovidot/backend (master)
$ git switch development
```

Use the package manager [npm](https://docs.npmjs.com/cli/v9/commands/npm-install) to install all dependencies in package.json file
```bash
User@User ~/ovidot/backend (development)
$ npm install
```

Create a .env file in the project root directory. In the .env file create environment variables for development in this manner:
```bash
User@User ~/ovidot/backend 
$ vi .env
```

Then create the following evironmental variables in the .env file with the appropriate values.
```vi
SECRETKEY=your-aplhanumeric-secret-key
ADMINKEY=your-alphanumeric-admin-key
HOST = 'your-local-host'
DB='your-mongo-db'
EMAIL = "sender-email"
EMAILPASSWORD = "sender-email-address"
```

To start the service
```bash
User@User ~/ovidot/backend
npm start

> backend@1.0.0 start
> nodemon app.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node app.js`
Server is now running on port {specified port}
MongoDB connected!
```

To run test
```bash
User@User ~/ovidot/backend
npm test
```

## Usage
### Authorization Endpoints
- Register a new user and get an access token for authentication purposes.
Request
```bash
POST /api/auth/signup
body {
    "email": "<USER'S EMAIL>",
    "password": "<PASSWORD>",
    "username": "<USERNAME>",
    "age": "<AGE>"
}
```
Response (Status 201)


- Login with a registered account
Request
```bash
POST /api/auth/login
body {
    "email": "<USER'S EMAIL>",
    "password": "<PASSWORD>"
}
```
Response on success (Status 200)
```bash
{
  "message": "Authentication successful",
  "userId": "user's id",
  "token": "token generated"
}
```
Response on failure (Status 401)
```bash
{
  "message": "Authentication failed"
}
```

- Logout a registered account
Request
```bash
GET /api/auth/<:userId>/logout [Auth: Bearer Token]
```
Response (Status 200)

- Change Logged-in user password
Request
```bash
POST /api/auth/<:userId>/change-password [Auth: Bearer Token]
body {
    "currentPassword": "<OLD PASSWORD>",
    "newPassword": "<NEW PASSWORD>"
}
```
Response (Status 204)

### User Endpoint
- Get user by userId
Request
```bash
GET /api/users/<:userId> [Auth: Bearer token]
```
Response (Status 200)
```bash
{
  "userId": "<USER ID>",
  "email": "<USER EMAIL>",
  "username": "<USERNAME>",
  "age": <AGE>,
  "cycles": [
    "<CYCLE ID>"
  ]
}
```

- Update user data
Request
```bash
PUT /api/users/<:userId> [Auth: Bearer token]
body {
    "username": "<NEW USERNAME",
    "age": <NEW AGE>
}
```
Response (Status 200)
```bash
{
  "userId": "<USER ID>",
  "email": "<USER EMAIL>",
  "username": "<NEW USERNAME>",
  "age": <NEW AGE>,
  "cycles": [
    "<CYCLE ID>"
  ]
}
```
Response (Status 400)
```bash
{
  "message": "Provide atleast a param to update: username or age"
}
```

- Delete user data
Request
```bash
DELETE /api/users/<:userId> [Auth: Bearer token]
```
Response (Status 204)

### Cycle Endpoint
- Create a Cycle
Request
```bash
POST /api/cycles/<:userId>/cycles [Auth: Bearer Token]
{
  "period": <INT: NUMBER>,
  "startdate": <DATE: CYCLE STARTDATE> | YYYY-MM-DD
}
```
Response (status 201)
```bash
{
    message: 'Cycle created',
    cycleId: "<CYCLE ID>"
}
```

- Get a cycle by cycleId
Request
```bash
GET /api/cycles/<:userId>/cycles/<:cycleId> [Auth: Bearer Token]
```
Response (Status 200)
```bash
{
  "_id": "<CYCLE ID>",
  "month": "<MONTH>",
  "period": <NUM: PERIOD LENGTH>,
  "ovulation": "<DATE: OVULATION DAY>",
  "start_date": "<DATE: CYCLE START DATE>",
  "next_date": "<DATE: NEXT CYCLE START DATE>",
  "days": <NUM: CYCLE DURATION DAYS>,
  "period_range": [
    "<DATE: MENSTRAUTION DAYS>",
  ],
  "ovulation_range": [
    "<DATE: DAYS WHICH OVULATION MAY FALL IN>",
  ],
  "unsafe_days": [
    "<DATE: UNSAFE DAYS>",
  ],
}
```

- Get all cycles for a given user
Request
```bash
GET /api/cycles/<:userId>/cycles [Auth: Bearer Token]
```
Response (Status 200)
```bash
[
    { <CYCLE DATA> }
]
```

- Get all cycles by month
Request
```bash
GET /api/cycles/<:userId>/<:month> [Auth: Bearer Token]
```
Response (Status 200)
```bash
[
    { <CYCLE DATA> }
]
```

- Update a cycle by cycleId
Request
```bash
PUT /api/cycles/:userId/cycles/:cycleId [Auth: Bearer Token]
body {
    "period": <INT: NUMBER>,
    "ovulation": "<DATE: DATE OVULATION OCCURED>" | YYYY-MM-DD
}
```
Response (Status 200)
```bash
{
  "_id": "<CYCLE ID>",
  "month": "<MONTH>",
  "period": <NUM: UPDATED PERIOD LENGTH>,
  "ovulation": "<DATE: UPDATED OVULATION DAY>",
  "start_date": "<DATE: CYCLE START DATE>",
  "next_date": "<DATE: UPDATED NEXT CYCLE START DATE>",
  "days": <NUM: UPDATED CYCLE DURATION DAYS>,
  "period_range": [
    "<DATE: UPDATED MENSTRAUTION DAYS>",
  ],
  "ovulation_range": [
    "<DATE: UPDaTED DAYS WHICH OVULATION MAY FALL IN>",
  ],
  "unsafe_days": [
    "<DATE: UPDATED UNSAFE DAYS>",
  ],
}
```

- Delete cycle by cycleId
Request
```bash
DELETE /api/cycles/:userId/cycles/:cycleId [Auth: Bearer Token]
```
Response (Status 204)
```bash
Cycle deleted
```

### Forget Password for logged out user
- Send forget password reset link
Request
```bash
POST /api/password/forgot-password
body {
    "email": "<EMAIL>"
}
```
Response (Status 201, Created): Password reset link sent to email
Response (Status 500): Password reset link sent to email | Internal Server Error

- Verify reset token
Request
```bash
GET /api/password/reset-password/:token
```
Response (Status 200)
```bash
{
    message : "success" ,
    token: <token>
}
```

- Reset Password
Request
```bash
POST /api/password/reset-password/:token
body {
    "password": "<PASSWORD>",
}
```
Response (Status 200): "Password changed"
