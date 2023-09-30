# Backend

## The tools used to implement the backend of ovidot are listed below:
* NodeJs
* Express
* MongoDB

## The tools used for testing:
* Mocha
* Sinon
* Chai

# Ovidot

 A Menstrual Cycle Tracker is a web application built with Express.js that provides user management, menstrual cycle tracking, and authentication features. It enables users to sign up, log in, and securely track their menstrual cycles. Additionally, there are admin routes for managing users and cycles.

## Features

- **User Authentication:** Secure user authentication with token verification.
- **Admin Panel:** Admin routes for managing users, cycles, and other entities.
- **Password Reset:** Routes for handling forgotten passwords and resetting passwords securely.
- **User Management:** CRUD operations for managing user data.
- **Menstrual Cycle Tracking:** Allows users to track their menstrual cycles.

## Installation

To run the Menstrual Cycle Tracker locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/Ovidot.git
    ```

2. Change directory:

    ```bash
    cd Ovidot
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

Start the application with the following command:

```bash
npm start

Visit http://localhost:5000 in your browser to access the application or make API requests.

## API Routes

Auth Routes
POST /signup: Create a new user account.
POST /login: Log in with existing credentials.
GET /logout: Log out the current user.
POST /change-password: Change the user's password.


Admin Routes
GET /users: Retrieve all users.
GET /users/:email: Retrieve a user by email.
PUT /users/:email: Update a user by email.
DELETE /users/:email: Delete a user.
GET /cycles: Retrieve all cycles.
GET /cycles/:cycleId: Retrieve a cycle by cycleId.
DELETE /cycles/:cycleId: Delete a cycle by cycleId.


User Routes
GET /:userId: Retrieve user data.
PUT /:userId: Update user data.
DELETE /:userId: Delete a user.


Cycle Routes
POST /:userId/cycles: Create a new cycle for a user.
GET /:userId/cycles: Retrieve all cycles for a user.
GET /:userId/cycles/:cycleId: Retrieve a specific cycle for a user.
GET /:userId/:month: Retrieve cycles for a given month for a user.
PUT /:userId/cycles/:cycleId: Update a cycle for a user.
DELETE /:userId/cycles/:cycleId: Delete a cycle for a user.


Authentication
The application uses token-based authentication to secure user routes. Token verification is required for sensitive operations.

Contributor:
Essie
Alao
Daniel
Mawoda
