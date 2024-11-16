
// Import necessary modules
const { Router } = require('express');
const cycleController = require('../../controllers/cycle.controller.js');

// Create an Express router
const router /** @type {ExpressRouter} */ = Router();


/**
 * Create cycle
 * @swagger
 * paths:
 *   /cycles/create:
 *     post:
 *       summary: Create a new cycle
 *       tags:
 *         - Cycle Routes
 *       security:
 *         - userToken: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: number
 *                   minLength: 2
 *                   maxLength: 8
 *                 startdate:
 *                   type: string
 *                   format: YYYY-MM-DD
 *                   example: 2023-05-01
 *                 ovulation:
 *                   type: string
 *                   format: YYYY-MM-DD
 *                   example: 2023-05-15
 *               required:
 *                 - startdate
 *
 *       responses:
 *            '201':
 *              description: Successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: Cycle created
 *                      cycleId:
 *                        type: string
 *
 *            '400':
 *              description: Validation Error and bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: startdate is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Specify a proper date - Date should not be less than 21 days or greater than present day
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Cycle already exist for this month - Delete to create another
 *
 *            '401':
 *               description: Unauthorized request
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Unauthorized
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Invalid token
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Account Deactivated
 *
 *            '404':
 *              description: User Not Found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: User not found
 *
 *            '500':
 *              description: MongooseError or JsonWebTokenError
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: MongooseError occured
 *                          error:
 *                            type: object
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: JsonWebTokenError occured
 *                          error:
 *                            type: object
 */
router.post('/create', cycleController.createCycle);

/**
 * Get all cycles
 * @swagger
 * paths:
 *   /cycles/getall:
 *     get:
 *       summary: Get all cycles
 *       tags:
 *         - Cycle Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: query
 *           name: month
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
 * 
 *       responses:
 *            '200':
 *              description: Successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
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
 *            '400':
 *              description: Validation Error and bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: startdate is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Specify a proper date - Date should not be less than 21 days or greater than present day
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Cycle already exist for this month - Delete to create another
 *
 *            '401':
 *               description: Unauthorized request
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Unauthorized
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Invalid token
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Account Deactivated
 *
 *            '404':
 *              description: User Not Found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: User not found
 *
 *            '500':
 *              description: MongooseError or JsonWebTokenError
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: MongooseError occured
 *                          error:
 *                            type: object
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: JsonWebTokenError occured
 *                          error:
 *                            type: object
 */
router.get('/getall', cycleController.fetchAllCycles);

/**
 * Get a cycle by cycleId
 * @swagger
 * paths:
 *   /cycles/:cycleId:
 *     get:
 *       summary: Get a cycle by cycleId
 *       tags: 
 *         - Cycle Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: path
 *           name: cycleId
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *            '200':
 *              description: Successful
 *              content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       cycle:
 *                         type: object
 *                         properties:
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
 *            '401':
 *               description: Unauthorized request
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Unauthorized
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Invalid token
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Account Deactivated
 *
 *            '404':
 *              description: User Not Found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                        message:
 *                          type: string
 *                          description: User not found
 *                      - properties:
 *                        message:
 *                          type: string
 *                          description: Cycle not found
 *
 *            '500':
 *              description: MongooseError or JsonWebTokenError
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: MongooseError occured
 *                          error:
 *                            type: object
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: JsonWebTokenError occured
 *                          error:
 *                            type: object
 */
router.get('/:cycleId', cycleController.fetchOneCycle);

/**
 * Update a cycle
 * @swagger
 * paths:
 *   /cycles/:cycleId:
 *     put:
 *       summary: Update a cycle
 *       tags:
 *         - Cycle Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: path
 *           name: cycleId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: one parameter must be provided
 *               properties:
 *                 period:
 *                   type: number
 *                   minLength: 2
 *                   maxLength: 2
 *                   example: 3
 *                 ovulation:
 *                   type: string
 *                   format: YYYY-MM-DD
 *                   example: 2023-05-14
 * 
 *       responses:
 *            '200':
 *              description: Successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      updated:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                            example: 61a6b9e9a9d9d9d9d9d9d9d9
 *                          month:
 *                            type: string
 *                            example: May
 *                          year:
 *                            type: number
 *                            example: 2023
 *                          period:
 *                            type: number
 *                            example: 3
 *                          start_date:
 *                            type: string
 *                            example: 2023-05-01T00:00:00.000Z
 *                          ovulation:
 *                            type: date
 *                            example: 2023-05-14T00:00:00.000Z
 *                          next_date:
 *                            type: date
 *                            example: 2023-05-29T00:00:00.000Z
 *                          days:
 *                            type: number
 *                            example: 28
 *                          period_range:
 *                            type: array
 *                            example: [2023-05-01T00:00:00.000Z, 2023-05-29T00:00:00.000Z]
 *                          ovulation_range:
 *                            type: array
 *                            example: [2023-05-14T00:00:00.000Z, 2023-05-28T00:00:00.000Z]
 *                          unsafe_days:
 *                            type: array
 *                            example: [2023-05-15T00:00:00.000Z, 2023-05-16T00:00:00.000Z]
 * 
 *            '400':
 *              description: Validation Error and bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: either period or ovulation is required
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Can't update the cycle with the same period and ovulation
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Can't update the cycle with the same period
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Can't update the cycle with the same ovulation
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Update can't be made after 30 days from current cycle start date
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Ovulation date must not exceed 18 days from start date
 *
 *            '401':
 *               description: Unauthorized request
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Unauthorized
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Invalid token
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Account Deactivated
 *
 *            '404':
 *              description: User Not Found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: User not found
 *
 *            '500':
 *              description: MongooseError or JsonWebTokenError
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: MongooseError occured
 *                          error:
 *                            type: object
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: JsonWebTokenError occured
 *                          error:
 *                            type: object
 */
router.put('/:cycleId', cycleController.updateCycle);

/**
 * Delete a cycle by cycleId
 * @swagger
 * paths:
 *   /cycles/:cycleId:
 *     delete:
 *       summary: Delete a cycle by cycleId
 *       tags:
 *         - Cycle Routes
 *       security:
 *         - userToken: []
 *       parameters:
 *         - in: path
 *           name: cycleId
 *           required: true
 *           schema:
 *             type: string
 *
 *       responses:
 *            '204':
 *               description: Successful
 *
 *            '401':
 *               description: Unauthorized request
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: object
 *                     oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Unauthorized
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Invalid token
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: Account Deactivated
 *
 *            '404':
 *              description: User Not Found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: User not found
 *
 *            '500':
 *              description: MongooseError or JsonWebTokenError
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    oneOf:
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: MongooseError occured
 *                          error:
 *                            type: object
 *                      - properties:
 *                          message:
 *                            type: string
 *                            description: JsonWebTokenError occured
 *                          error:
 *                            type: object
 */
router.delete('/:cycleId', cycleController.deleteCycle);


module.exports = router;
