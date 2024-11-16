// Import necessary modules
const { Router } = require('express');
const adminController = require('../controller/admin.controller.js');
const tokenVerification = require('../../middleware/tokenVerification.js');
const appController = require('../../controllers/register.controller.js');
const passwordController = require('../../controllers/password.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();


/**
 * Login into the admin profile
 * @swagger
 * paths:
 *   /admin/login:
 *     post:
 *       summary: Log into the admin profile
 *       tags:
 *         - Admin Routes
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email_or_username:
 *                   type: string
 *                   example: super@example.com
 *                 password:
 *                   type: string
 *                   example: Ovidotlogin123#
 *               required:
 *                 - email_or_username
 *                 - password
 *
 *       responses:
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
 *                         description: email, username or password incorrect
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Account deactivated - Contact your super administrator
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: email_or_username is required
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
router.post('/login', adminController.login.bind(adminController));

/**
 * Route to logout admin
 * @swagger
 * paths:
 *   /admin/logout:
 *      get:
 *        summary: Logout admin
 *        tags:
 *          - Admin Routes
 *        security:
 *          - adminToken: []
 * 
 *        responses:
 *         '200':
 *            description: Succesful
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Logout Successful
 *
 *         '401':
 *            description: Unauthorized request
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Unauthorized
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Invalid token
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Account Deactivated
 *
 *         '500':
 *            description: Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    error:
 *                      type: object
 */
router.get('/logout', tokenVerification.adminTokenVerification, appController.logout);

/**
 * Get all users
 * @swagger
 * paths:
 *   /admin/users:
 *      get:
 *       summary: Retrieve all users
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       parameters:
 *         - in: query
 *           name: count
 *           schema:
 *             type: boolean
 *             default: false
 *         - in: query
 *           name: fname
 *           schema:
 *             type: string
 *             example: daniel
 *         - in: query
 *           name: lname
 *           schema:
 *             type: string
 *             example: eyang
 *         - in: query
 *           name: username
 *           schema:
 *             type: string
 *             example: tediyang
 *         - in: query
 *           name: dob 
 *           schema:
 *             type: string
 *             example: 2023-05-30
 *         - in: query
 *           name: role
 *           schema:
 *             type: string
 *             example: USER
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             example: ACTIVE
 *         - in: query
 *           name: period
 *           schema:
 *             type: number
 *             minimum: 2
 *             maximum: 8
 *             example: 2
 *         - in: query
 *           name: page
 *           schema:
 *             type: number
 *             default: 1 
 *         - in: query
 *           name: size
 *           schema:
 *             type: number
 *             default: 20
 *         - in: query
 *           name: createdAt
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: object
 *                 properties:
 *                   time_share:
 *                     type: string
 *                     enum: 
 *                       - hour
 *                       - day
 *                       - week
 *                       - month
 *                       - year
 *                     default: hour
 *                   times:
 *                     type: integer
 *                     default: 1
 *               exact_range:
 *                 type: string
 *                 example: 2023-05-30_2023-05-31
 *                 description: Must be in the format "YYYY-MM-DD_YYYY-MM-DD for more than a day and "YYYY-MM-DD" for 24 hours of the day
 *
 *       responses:
 *          '200':
 *             description: Successful
 *             content:
 *              application/json:
 *                schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: object
 *                    properties:
 *                      users:
 *                        type: object
 *                        description: array of all users
 *                      have_next_page:
 *                        type: boolean
 *                        description: if more than one page exist
 *                        example: false
 *                      total_pages:
 *                        type: number
 *                        description: total number of pages
 *                        example: 1
 * 
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: both range and exact_range can't be provided.
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
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
router.get('/users', tokenVerification.adminTokenVerification, adminController.getUsers.bind(adminController));

/**
 * Get user by email
 * @swagger
 * paths:
 *  /admin/users/email:
 *     post:
 *       summary: Retrieve a user by email
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *
 *       responses:
 *          '200':
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: object
 *                      properties:
 *                        _id:
 *                           type: string
 *                           description: user id
 *                        name:
 *                           type: object
 *                           properties:
 *                              fname:
 *                                 type: string
 *                                 description: first name
 *                              lname:
 *                                 type: string
 *                                 description: last name
 *                        email:
 *                           type: string
 *                           description: user email
 *                        phone:
 *                           type: string
 *                           description: user phone number
 *                           example: +2347065658897
 *                        username:
 *                           type: string
 *                           description: user username
 *                        dob:
 *                           type: date
 *                           description: User date of birth
 *                           example: 1996-05-30T00:00:00.000Z
 *                        period:
 *                           type: number
 *                           description: user period
 *                        role:
 *                           enum:
 *                             - USER
 *                             - ADMIN
 *                             - SUPER ADMIN
 *                           type: string
 *                           description: user role
 *                           example: USER
 *                        status:
 *                           enum:
 *                             - ACTIVE
 *                             - DEACTIVATED
 *                           type: string
 *                           description: user status
 *                           example: ACTIVE
 *                        _cycles:
 *                           type: array
 *                           items:
 *                              type: string
 *                              description: user cycle id
 *                        notificationsList:
 *                           type: array
 *                           items:
 *                              type: object
 *                              properties:
 *                                 _id:
 *                                    type: string
 *                                 action:
 *                                    type: string
 *                                 message:
 *                                    type: string
 *                                 status:
 *                                    type: string
 *                                 cretatedAt:
 *                                    type: date
 *                                 updatedAt:
 *                                    type: date
 * 
 *          '400':
 *             description: Validation Error
 *             content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: email is required
 * 
 *          '401':
 *             description: Unauthorized request
 *             content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Unauthorized
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Invalid token
 *                   - properties:
 *                       message:
 *                         type: string
 *                         description: Account Deactivated
 *
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: User with {email} not found
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
router.post('/users/email', tokenVerification.adminTokenVerification, adminController.getUser.bind(adminController));

/**
 * Fetch all user cycles
 * @swagger
 * paths:
 *   /admin/users/email/cycles:
 *     post:
 *       summary: Retrieve all cycles for a user by email
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *               required:
 *                 - email
 *       parameters:
 *         - in: query
 *           name: month
 *           required: false
 *           schema:
 *             type: string
 *             description: 
 *               Can be either a number (1-12) or a month name (e.g., January).
 *               If a number is provided, it must be between 1 and 12.
 *             example: 5
 *         - in: query
 *           name: year
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1970
 *             maximum: 2100
 *             description: Year for which cycles are requested.
 *             example: 2023
 *         - in: query
 *           name: period
 *           schema:
 *             type: integer
 *             minimum: 2
 *             maximum: 8
 *             description: The cycle period.
 *             example: 4
 *         - in: query
 *           name: count
 *           schema:
 *             type: boolean
 *             description: if true it returns the number of cycles.
 *             default: false
 *         - in: query
 *           name: createdAt
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: object
 *                 properties:
 *                   time_share:
 *                     type: string
 *                     enum: 
 *                       - hour
 *                       - day
 *                       - week
 *                       - month
 *                       - year
 *                     default: hour
 *                   times:
 *                     type: integer
 *                     default: 1
 *               exact_range:
 *                 type: string
 *                 example: 2023-05-30_2023-05-31
 *                 description: Must be in the format "YYYY-MM-DD_YYYY-MM-DD for more than a day and "YYYY-MM-DD" for 24 hours of the day
 *
 *       responses:
 *          '200':
 *              description: Successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                     - properties:
 *                        count:
 *                          type: number
 *                          example: 5
 *                     - properties:
 *                        cycles:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                               _id:
 *                                 type: string
 *                                 example: 61a6b9e9a9d9d9d9d9d9d9d9
 *                               month:
 *                                 type: string
 *                                 example: May
 *                               year:
 *                                 type: number
 *                                 example: 2023
 *                               period:
 *                                 type: number
 *                                 example: 4
 *                               start_date:
 *                                 type: string
 *                                 example: 2023-05-01T00:00:00.000Z
 *                               ovulation:
 *                                 type: date
 *                                 example: 2023-05-14T00:00:00.000Z
 *                               next_date:
 *                                 type: date
 *                                 example: 2023-05-29T00:00:00.000Z
 *                               days:
 *                                 type: number
 *                                 example: 28
 *                               period_range:
 *                                 type: array
 *                                 example: [2023-05-01T00:00:00.000Z, 2023-05-29T00:00:00.000Z]
 *                               ovulation_range:
 *                                 type: array
 *                                 example: [2023-05-14T00:00:00.000Z, 2023-05-28T00:00:00.000Z]
 *                               unsafe_days:
 *                                 type: array
 *                                 example: [2023-05-15T00:00:00.000Z, 2023-05-16T00:00:00.000Z]
 *
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: both range and exact_range can't be provided.
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 * 
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: User with {email} not found
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
router.post('/users/email/cycles', tokenVerification.adminTokenVerification, adminController.getUserCycles.bind(adminController));

/**
 * Update user
 * @swagger
 * paths:
 *   /admin/users/email:
 *     put:
 *       summary: Update a user by email
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oldEmail:
 *                   type: string
 *                   example: steven@example.com
 *                 newEmail:
 *                   type: string
 *                   example: stevendidie@example.com
 *               required:
 *                 - oldEmail
 *                 - newEmail
 * 
 *       responses:
 *          '200':
 *            description: success
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: object
 *                      properties:
 *                        _id:
 *                           type: string
 *                           description: user id
 *                        name:
 *                           type: object
 *                           properties:
 *                              fname:
 *                                 type: string
 *                                 description: first name
 *                              lname:
 *                                 type: string
 *                                 description: last name
 *                        email:
 *                           type: string
 *                           description: user email
 *                        phone:
 *                           type: string
 *                           description: user phone number
 *                           example: +2347065658897
 *                        username:
 *                           type: string
 *                           description: user username
 *                        dob:
 *                           type: date
 *                           description: User date of birth
 *                           example: 1996-05-30T00:00:00.000Z
 *                        period:
 *                           type: number
 *                           description: user period
 *                        role:
 *                           enum:
 *                             - USER
 *                             - ADMIN
 *                             - SUPER ADMIN
 *                           type: string
 *                           description: user role
 *                           example: USER
 *                        status:
 *                           enum:
 *                             - ACTIVE
 *                             - DEACTIVATED
 *                           type: string
 *                           description: user status
 *                           example: ACTIVE
 *                        _cycles:
 *                           type: array
 *                           items:
 *                              type: string
 *                              description: user cycle id
 *                        notificationsList:
 *                           type: array
 *                           items:
 *                              type: object
 *                              properties:
 *                                 _id:
 *                                    type: string
 *                                 action:
 *                                    type: string
 *                                 message:
 *                                    type: string
 *                                 status:
 *                                    type: string
 *                                 cretatedAt:
 *                                    type: date
 *                                 updatedAt:
 *                                    type: date
 *                        updatedAt:
 *                           type: date
 *
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: oldEmail is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: both range and exact_range can't be provided.
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 * 
 *          '403':
 *            description: Forbidden access
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Forbidden
 * 
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: User with {email} not found
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
router.put('/users/email', tokenVerification.adminTokenVerification, adminController.updateUser.bind(adminController));

/**
 * Delete user
 * @swagger
 * paths:
 *   /admin/users/email:
 *     delete:
 *       summary: Delete a user by email
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *               required:
 *                 - email
 *
 *       responses:
 *          '204':
 *             description: Successful
 *
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: email is required
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 * 
 *          '403':
 *            description: Forbidden access
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Forbidden
 * 
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: email not found
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
router.delete('/users/email', tokenVerification.adminTokenVerification, adminController.deleteUser);

/**
 * Send forget pass to user
 * @swagger
 * paths:
 *  /admin/users/forgot-password:
 *     post:
 *       summary: Send a forgot password link to a user
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
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
router.post('/users/forgot-password', tokenVerification.adminTokenVerification, passwordController.forgotPass.bind(passwordController));

/**
 * Get all cycles
 * @swagger
 * paths:
 *   /admin/cycles:
 *     get:
 *       summary: Retrieve all cycles
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       parameters:
 *         - in: query
 *           name: month
 *           required: false
 *           schema:
 *             type: string
 *             description: 
 *               Can be either a number (1-12) or a month name (e.g., January).
 *               If a number is provided, it must be between 1 and 12.
 *             example: 5
 *         - in: query
 *           name: year
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1970
 *             maximum: 2100
 *             description: Year for which cycles are requested.
 *             example: 2023
 *         - in: query
 *           name: period
 *           schema:
 *             type: integer
 *             minimum: 2
 *             maximum: 8
 *             description: The cycle period.
 *             example: 4
 *         - in: query
 *           name: count
 *           schema:
 *             type: boolean
 *             description: if true it returns the number of cycles.
 *             default: false
 *         - in: query
 *           name: start_date
 *           schema:
 *             type: string
 *             description: the day the cycle started
 *             example: 2023-05-01
 *         - in: query
 *           name: ovulation
 *           schema:
 *             type: string
 *             description: the day ovulation occured
 *             example: 2023-05-14
 *         - in: query
 *           name: days
 *           schema:
 *             type: number
 *             description: the duration of the cycle
 *             example: 28
 *         - in: query
 *           name: page
 *           schema:
 *             type: number
 *             default: 1
 *         - in: query
 *           name: size
 *           schema:
 *             type: number
 *             default: 20
 *
 *       responses:
 *          '200':
 *            description: Successful
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        count:
 *                          type: number
 *                          example: 50
 *                    - properties:
 *                      cycles:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                             _id:
 *                               type: string
 *                               example: 61a6b9e9a9d9d9d9d9d9d9d9
 *                             month:
 *                               type: string
 *                               example: May
 *                             year:
 *                               type: number
 *                               example: 2023
 *                             period:
 *                               type: number
 *                               example: 4
 *                             start_date:
 *                               type: string
 *                               example: 2023-05-01T00:00:00.000Z
 *                             ovulation:
 *                               type: date
 *                               example: 2023-05-14T00:00:00.000Z
 *                             next_date:
 *                               type: date
 *                               example: 2023-05-29T00:00:00.000Z
 *                             days:
 *                               type: number
 *                               example: 28
 *                             period_range:
 *                               type: array
 *                               example: [2023-05-01T00:00:00.000Z, 2023-05-29T00:00:00.000Z]
 *                             ovulation_range:
 *                               type: array
 *                               example: [2023-05-14T00:00:00.000Z, 2023-05-28T00:00:00.000Z]
 *                             unsafe_days:
 *                               type: array
 *                               example: [2023-05-15T00:00:00.000Z, 2023-05-16T00:00:00.000Z]
 *
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: both range and exact_range can't be provided.
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
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
router.get('/cycles', tokenVerification.adminTokenVerification, adminController.getCycles);

/**
 * Fetch cycle by id
 * @swagger
 * paths:
 *   /admin/cycles/:cycleId:
 *     get:
 *       summary: Retrieve a cycle by cycleId
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       parameters:
 *         - in: path
 *           name: cycleId
 *           required: true
 *           schema:
 *             type: string
 *
 *       responses:
 *          '200':
 *            description: Successful
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      cycle:
 *                        type: object
 *                        properties:
 *                           _id:
 *                             type: string
 *                             example: 61a6b9e9a9d9d9d9d9d9d9d9
 *                           month:
 *                             type: string
 *                             example: May
 *                           year:
 *                             type: number
 *                             example: 2023
 *                           period:
 *                             type: number
 *                             example: 4
 *                           start_date:
 *                             type: string
 *                             example: 2023-05-01T00:00:00.000Z
 *                           ovulation:
 *                             type: date
 *                             example: 2023-05-14T00:00:00.000Z
 *                           next_date:
 *                             type: date
 *                             example: 2023-05-29T00:00:00.000Z
 *                           days:
 *                             type: number
 *                             example: 28
 *                           period_range:
 *                             type: array
 *                             example: [2023-05-01T00:00:00.000Z, 2023-05-29T00:00:00.000Z]
 *                           ovulation_range:
 *                             type: array
 *                             example: [2023-05-14T00:00:00.000Z, 2023-05-28T00:00:00.000Z]
 *                           unsafe_days:
 *                             type: array
 *                             example: [2023-05-15T00:00:00.000Z, 2023-05-16T00:00:00.000Z]
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 *
 *          '404':
 *            description: Cycle Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Cycle data not found
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
router.get('/cycles/:cycleId', tokenVerification.adminTokenVerification, adminController.getCycle);

/**
 * Delete cycle
 * @swagger
 * paths:
 *   /admin/cycles/:cycleId:
 *     delete:
 *       summary: Delete a cycle by cycleId
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       parameters:
 *         - in: path
 *           name: cycleId
 *           required: true
 *           schema:
 *             type: string
 *
 *       responses:
 *          '204':
 *            description: Successful
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 *
 *          '403':
 *            description: Forbidden access
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Forbidden
 * 
 *          '404':
 *            description: Cycle Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Cycle not found
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
router.delete('/cycles/:cycleId', tokenVerification.adminTokenVerification, adminController.deleteCycle);

/**
 * Switch Role
 * @swagger
 * paths:
 *   /admin/switch:
 *     put:
 *       summary: Switch admin role
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email_username_id:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: 
 *                     - USER
 *                     - ADMIN
 *                     - SUPER ADMIN
 *                   default: USER
 *               required:
 *                 - email_username_id
 *                 - role
 *
 *       responses:
 *          '200':
 *             description: Successful
 *             content:
 *              application/json:
 *                schema:
 *                type: object
 *                properties:
 *                  admin:
 *                    type: object
 * 
 *          '400':
 *             description: Validation Error
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: email_username_id is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: role is required
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 * 
 *          '403':
 *            description: Forbidden access
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Forbidden
 * 
 *          '404':
 *            description: Admin Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Admin not found
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
router.put('/switch', tokenVerification.adminTokenVerification, adminController.switchAdmin);

/**
 * Deactivate admin
 * @swagger
 * paths:
 *   /admin/deactivate:
 *     put:
 *       summary: Deactivate admin
 *       tags:
 *         - Admin Routes
 *       security:
 *         - adminToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email_username_id:
 *                   type: string
 *               required:
 *                 - email_username_id
 *
 *       responses:
 *          '200':
 *             description: Successful
 *             content:
 *              application/json:
 *                schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Admin deactivted
 * 
 *          '400':
 *             description: Validation Error and bad request
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: email_username_id is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Can't deactivate a super admin
 *
 *          '401':
 *             description: Unauthorized request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Unauthorized
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid token
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Account Deactivated
 * 
 *          '403':
 *            description: Forbidden access
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Forbidden
 * 
 *          '404':
 *            description: Admin Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Admin not found
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
router.put('/deactivate', tokenVerification.adminTokenVerification, adminController.deactivateAdmin);


module.exports = router;
