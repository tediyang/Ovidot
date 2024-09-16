// Import necessary modules
const { Router } = require('express');
const appController = require('../controllers/register.controller.js');
const passwordController = require('../controllers/password.controller.js');


// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * Route to register user
 * @swagger
 * paths:
 *  /signup:
 *    post:
 *      summary: Register a new user
 *      tags:
 *        - General Routes
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fname:
 *                  type: string
 *                  description: First Name
 *                lname:
 *                  type: string
 *                  description: Last Name
 *                username:
 *                  type: string
 *                  description: (Optional) username
 *                phone:
 *                  type: string
 *                  minLength: 10
 *                  maxLength: 16
 *                  description: starts with country code
 *                  pattern: ^\+\d+$
 *                dob:
 *                  type: string
 *                  example: 1996-05-30
 *                  format: YYYY-MM-DD
 *                email:
 *                  type: string
 *                  required: true
 *                  example: user@example.com
 *                  description: User's email address
 *                  format: email  # Ensures valid email format
 *                period:
 *                  type: number
 *                  minLength: 2
 *                  maxLength: 8
 *                  example: 3
 *                password:
 *                  type: string
 *                  description: Capital, small, number and special character
 *                  pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$
 * 
 *              required:
 *                  - fname
 *                  - lname
 *                  - phone
 *                  - dob
 *                  - email
 *                  - period
 *                  - password

 *      responses:
 *        '201':
 *          description: Successful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Registration Successful
 *        '400':
 *          description: Validation Error
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                properties:
 *                   message:
 *                     type: string
 *                     example: lname is required
 *        '500':
 *          description: MongooseError or JsonWebTokenError
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                oneOf:
 *                  - properties:
 *                      message:
 *                        type: string
 *                        description: MongooseError occured
 *                      error:
 *                        type: object
 *                  - properties:
 *                      message:
 *                        type: string
 *                        description: JsonWebTokenError occured
 *                      error:
 *                        type: object
 */
router.post('/signup', appController.signup);

/**
 * Route to log in a user
 * @swagger
 * paths:
 *  /login:
 *    post:
 *      summary: Log in a user
 *      tags:
 *        - General Routes
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email_or_phone:
 *                  type: string
 *                  example: user@example.com
 *                password:
 *                  type: string
 *                  example: Ovidotlogin123#
 *              required:
 *                - email_or_phone
 *                - password
 * 
 *      responses:
 *         '200':
 *           description: Successful
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Authentication successful
 *                    token:
 *                      type: string
 *
 *         '400':
 *           description: Validation Error or Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: email, phone or password incorrect
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Account deactivated
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: email_or_phone is required
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: password is required
 *
 *         '500':
 *           description: MongooseError or JsonWebTokenError
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: MongooseError occured
 *                       error:
 *                         type: object
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: JsonWebTokenError occured
 *                       error:
 *                         type: object
 */

router.post('/login', appController.login.bind(appController));

/**
 * Forget password route
 * @swagger
 * paths:
 *   /forget-password:
 *     post:
 *       summary: allow user to setup a new password
 *       tags:
 *         - General Routes
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: user email linked to profile
 *                 front_url:
 *                   type: string
 *                   description: frontend url to forget password page
 *               required:
 *                 - email
 *                 - front_url
 *
 *       responses:
 *          '201':
 *            description: Successfully
 *            content:
 *              application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Password reset link succesfully sent to ${email}
 *
 *          '400':
 *            description: Validation Error or Bad request
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: email is required
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: front_url is required
 *
 *          '404':
 *            description: Not Found Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: ${email} not found
 *
 *          '500':
 *            description: MongooseError or JsonWebTokenError
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: MongooseError occured
 *                        error:
 *                          type: object
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: JsonWebTokenError occured
 *                        error:
 *                          type: object
 */
router.post('/forgot-password', passwordController.forgotPass.bind(passwordController));

/**
 * Validate reset password token
 * @swagger
 * paths:
 *   /reset-password/{token}:
 *     get:
 *       summary: valid reset then send from url param
 *       tags:
 *         - General Routes
 *       parameters:
 *         - in: path
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *          '200':
 *            description: Successful
 *            content:
 *              application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: success
 *                     token:
 *                        type: string
 *
 *          '401':
 *            description: Bad request
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Requires a token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid or expired token
 *
 *          '500':
 *            description: MongooseError or JsonWebTokenError
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: MongooseError occured
 *                        error:
 *                          type: object
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: JsonWebTokenError occured
 *                        error:
 *                          type: object
 */
router.get('/reset-password/:token', passwordController.VerifyResetPass);

/**
 * Reset password route
 * @swagger
 * paths:
 *   /reset-password:
 *     put:
 *       summary: allow user to setup a new password
 *       tags:
 *         - General Routes
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   required: true
 *                   description: valid token
 *                 new_password:
 *                   type: string
 *                   required: true
 *                   description: user new password
 * 
 *       responses:
 *          '200':
 *            description: Successful
 *            content:
 *              application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Password successfully updated
 *
 *          '400':
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: token is required
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: new_password is required
 *
 *          '401':
 *            description: Bad request
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Invalid request, expired token
 *
 *          '500':
 *            description: MongooseError or JsonWebTokenError
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: MongooseError occured
 *                        error:
 *                          type: object
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: JsonWebTokenError occured
 *                        error:
 *                          type: object
 */
router.put('/reset-password', passwordController.ResetPass);


module.exports = router;
