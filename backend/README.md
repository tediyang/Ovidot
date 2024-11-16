# Ovidot API Service Backend
 This is a Menstrual Cycle Tracker built with Express.js that provides user management, menstrual cycle tracking, and authentication features. It enables users to sign up, log in, and securely track their menstrual cycles. Additionally, there are admin routes for managing users and cycles.

## Contributors
- [Eyang, Daniel Eyoh](https://github.com/Tediyang)
- [Ekabua Mawoda](https://github.com/mdekabs)

## Features
- **User Authentication:** Secure user authentication with token verification.
- **Admin Panel:** Admin routes for managing users, cycles, and other entities.
- **Password Reset:** Routes for handling forgotten passwords and resetting passwords securely.
- **User Management:** CRUD operations for managing user data.
- **Menstrual Cycle Tracking:** Allows users to track their menstrual cycles.

## Tech
* [Node Js](https://nodejs.org/en)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Express Js](https://expressjs.com/)
* [Redis](https://redis.io/)
* [Js Doc](https://github.com/jsdoc/jsdoc)

## Installation
1. Clone repository from github in your OS terminal
```bash
User@User ~
$ git clone https://github.com/Tediyang/ovidot.git
```

2. Change directory to the project directory
```bash
User@User ~ 
$ cd ovidot/backend
```

3. Change branch to master branch
```bash
User@User ~/ovidot/backend (master)
$ git switch master
```

4. Use the package manager [npm](https://docs.npmjs.com/cli/v9/commands/npm-install) to install all dependencies in package.json file
```bash
User@User ~/ovidot/backend (master)
$ npm install
```

5. Create a .env file in the project root directory. In the .env file create environment variables for master in this manner:
```bash
User@User ~/ovidot/backend 
$ vi .env
```

6. Then create the following environmental variables in the .env file with the appropriate values in [.example.env](./.example.env)

7. To start the service
```bash
User@User ~/ovidot/backend
npm start
```

```bash
2023-11-04T08:25:08.040Z INFO: Server listening on PORT {PORT} 
2023-11-04T08:25:08.045Z INFO: Mail job is active and scheduled to run every 30 seconds. 
2023-11-04T08:25:08.054Z INFO: Redis Client connected on PORT {PORT}
2023-11-04T08:25:08.090Z INFO: Database connection successfully 
2023-11-04T08:25:08.105Z INFO: ovidot: We are open for business 
2023-11-04T08:25:08.105Z INFO: ovidot: ultimate admin is set 
```

## Usage
For local connection: http://127.0.0.1:{PORT}/{endpoint}

### UI Documentaion
UI docmentation: http://127.0.0.1:{PORT}/{endpoint}/api/v1/swagger/documentation
