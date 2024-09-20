
// Import necessary modules
const { Router } = require('express');
const userController = require('../../controllers/user.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();

/**
 * Get user
 * @swagger
 * paths:
 *   /users/fetch:
 *     get:
 *       summary: Get user data
 *       tags:
 *         - User Routes
 *       security:
 *         - userToken: []
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
 *                      description: User does not exist
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
router.get('/fetch', userController.fetchUser.bind(userController));

/**
 * Update user
 * @swagger
 * paths:
 *  /users/update:
 *    put:
 *      summary: Update user data
 *      tags:
 *        - User Routes
 *      security:
 *         - userToken: []
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
 *                dob:
 *                  type: string
 *                  format: YYYY-MM-DD
 *                  example: 1996-05-30
 *                period:
 *                  type: number
 *                  minLength: 2
 *                  maxLength: 8
 *                  example: 3
 *                username:
 *                  type: string
 *                sensitive:
 *                  type: object
 *                  description: Information here requires user password to update
 *                  properties:
 *                    phone:
 *                      type: string
 *                      minLength: 10
 *                      maxLength: 16
 *                      description: User's phone number (pattern for validation can be added)
 *                      pattern: ^\+\d+$
 *                    new_password:
 *                      type: string
 *                      description: Capital, small, number and special character
 *                      pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$
 *                password:
 *                  type: string
 *                  pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$
 *                  description: This is required only when sensitive information wants to be updated.
 *
 *      responses:
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
 *                        updatedAt:
 *                           type: date
 *
 *          '400':
 *            description: Validation Error and bad request
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: provide password to update sensitive data
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: You are too young or above the age to menstrate
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Invalid password
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
 *                      description: User not found
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
router.put('/update', userController.updateUser.bind(userController));

/**
 * Deactivate account
 * @swagger
 * paths:
 *  /users/deactivate:
 *    get:
 *      summary: Deactivate account
 *      tags:
 *        - User Routes
 *      security:
 *         - userToken: []
 * 
 *      responses:
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
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: User not found
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
router.get('/deactivate', userController.deactivateUser);

/**
 * Delete account
 * @swagger
 * paths:
 *  /users/delete:
 *    get:
 *      summary: Delete account
 *      tags:
 *        - User Routes
 *      security:
 *         - userToken: []
 * 
 *      responses:
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
 *          '404':
 *            description: User Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: User not found
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
router.delete('/delete', userController.deleteUser);

/**
 * get notification by id
 * @swagger
 * paths:
 *   /users/notifications/:id:
 *     get:
 *       summary: Get notification by id
 *       tags:
 *         - User Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: path
 *           name: id
 *           description: existing notification id
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *          '200':
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    note:
 *                      type: object
 *                      properties:
 *                        _id:
 *                           type: string
 *                        message:
 *                           type: string
 *                        status:
 *                           type: string
 *                           enum:
 *                             - UNREAD
 *                             - READ
 *                        action:
 *                          type: string
 *                        itemId:
 *                          type: string
 *                        createdAt:
 *                          type: string
 *                        updatedAt:
 *                          type: string
 * 
 *          '400':
 *            description: Invalid request, id is required
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
 *            description: File Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: User not found
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Notification not found
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
router.get('/notifications/:id', userController.getNotification);

/**
 * delete notification by id
 * @swagger
 * paths:
 *   /users/notifications/:id:
 *     delete:
 *       summary: Delete notification by id
 *       tags:
 *         - User Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: path
 *           name: id
 *           description: existing notification id
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *          '204':
 *            description: Successful
 * 
 *          '400':
 *            description: Invalid request, id is required
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
 *            description: File Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: User not found
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Notification not found
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
router.delete('/notifications/:id', userController.deleteNotification);

/**
 * Get notifications
 * @swagger
 * paths:
 *   /users/notifications:
 *     get:
 *       summary: Get notifications
 *       tags:
 *         - User Routes
 *       security:
 *         - userToken: []
 * 
 *       responses:
 *          '200':
 *            description: Successful
 *            content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  notifications:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                        action:
 *                          type: string
 *                        message:
 *                          type: string
 *                        status:
 *                          type: string
 *                        cretatedAt:
 *                          type: date
 *                        updatedAt:
 *                          type: date
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
 *            description: File Not Found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  oneOf:
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: User not found
 *                    - properties:
 *                        message:
 *                          type: string
 *                          description: Notification not found
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
router.get('/notifications', userController.getNotifications);


module.exports = router;
