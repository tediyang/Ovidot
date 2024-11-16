const { compare } = require('bcrypt');
const { Admin, Cycle, User, page_info, MongooseError } = require('../../models/engine/database');
const handleResponse = require('../../utility/helpers/handle.response');
const userPopulate = require('../../utility/helpers/user.populate');
const requestValidator = require('../../utility/validators/requests.validator.js');
const dateValidator = require('../../utility/validators/date.validator');
const { Role, userStatus, Collections } = require('../../enums');
const { logger } = require('../../middleware/logger');
const Joi = require('joi');
const { Types } = require('mongoose');
const { sign, JsonWebTokenError } = require('jsonwebtoken');
require('dotenv').config();


/**
 * Admin Controller
 * @module AdminController
 */
class AdminController {

  /**
   * Initialize the admin controller
   * @constructor
   * @param {String} [secretKey=process.env.ADMINKEY] - The secret key to use for signing tokens
   */
  constructor() {
    this._secretKey = process.env.ADMINKEY;
    this._excluded = process.env.EXCLUDE;
  }

  /**
    * Generate token
    * @param {Admin} admin - Admin Object to generate token for. 
    */
  createToken(admin) {
    return sign({ id: admin._id, role: admin.role }, this._secretKey, { expiresIn: '1h' });
  };

  /**
   * @async Login an admin user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async login(req, res) {
    try{
      const { value, error } = requestValidator.AdminLogin.validate(req.body);

      if (error) {
        throw error;
      }

      // validate email/username

      const [ username, email ] = await Promise.all(
        [
          Admin.findOne({ username: value.email_or_username }),
          Admin.findOne({ email: value.email_or_username })
        ]
      );

      const admin = username || email;
      if (!admin) {
        return handleResponse(res, 400, "email, username or password incorrect");
      }

      if (admin.status === userStatus.deactivated) {
        return handleResponse(res, 400, "Account deactivated - Contact your super administrator");
      }
      const matched = await compare(value.password, admin.password);
      if (matched) {
        const token = this.createToken(admin);

        // reset trials
        admin.loginAttempts = 0;
        await admin.save();

        logger.info(`${admin.role} ${admin._id} logged in successfully at ${new Date()}`);
        return res.status(200).json({
          message: 'Authentication successful',
          token
        });
      } else {
        if (admin.loginAttempts >= 3) {
          admin.status = userStatus.deactivated;
          await admin.save();

          const resolve = `Account deactivated - Contact your super administrator`;
          return handleResponse(res, 400, resolve);
        }

        admin.loginAttempts += 1;
        await admin.save();
        return handleResponse(res, 400, "email, username or password incorrect");
      }
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    };
  };

  /**
   * @async Get all users.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns
   * @throws {Object} - Error response object.
   */
  async getUsers(req, res) {
    try {
      // validate body
      const { value, error } = requestValidator.GetUsers.validate(req.query);
      if (error) {
        throw error;
      }

      // building filter
      const query = {};
      const { fname, lname, username, dob, role, createdAt, period, status } = value;

      if (fname) {
        query['name.fname'] = fname.toLowerCase()
      }

      if (lname) {
        query['name.lname'] = lname.toLowerCase()
      }

      if (username) {
        query.username = username.toLowerCase()
      }

      if(dob) {
        query.dob = dob;
      }

      if(role) {
        query.role = role;
      }

      if(status) {
        query.status = status;
      }

      if(period) {
        query.period = period;
      }

      if (createdAt) {
        dateValidator.dateParse(query, createdAt)
      }

      // if count is true, admin just wants a count of the filtered documents
      if (value.count) {
        const count = await User
          .countDocuments(query);

        logger.info(`${req.user.role} ${req.user.id} fetched the count of users data successfully`);
        return res
          .status(200)
          .json({
            count: count,
          });
      }

      const { haveNextPage, currentPageExists, totalPages } = await page_info(query, Collections.User, value.size, value.page);

      let gather_data = [];

      if (currentPageExists) {
        const users = await User
          .find({ ...query }, this._excluded)
          .skip((value.page - 1) * value.size)
          .limit(value.size)
          .sort({ createdAt: -1 })
          .exec(); //get orders

        gather_data = [
          users,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if(!currentPageExists) {
        gather_data = [
          [],
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      logger.info(`${req.user.role} ${req.user.id} fetched all users data successfully`);
      return res
        .status(200)
        .json({
          users: gather_data[0],
          have_next_page: gather_data[1],
          total_pages: gather_data[2]
        });

    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    }
  };

  /**
   * Return all the cycle for a given user.
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns 
   */
  async getUserCycles(req, res) {
    try {
      const { value, err } = requestValidator.GetUserCycles[0].validate(req.body);
      if (err) {
        throw err;
      }

      const filter = requestValidator.GetUserCycles[1].validate(req.query);
      if (filter.error) {
        throw filter.error;
      }

      const user = await User.findOne({ email: value.email });
      if (!user) {
        return handleResponse(res, 404, `User with ${value.email} not found`);
      }

      if (filter.value.length == 0) {
        const populate_user = await userPopulate.populateWithCycles(user.id);
        return res.status(200).json({ allCycles: populate_user._cycles });
      }

      // building filter
      const query = {};
      const { count, month, year, period, size, page, createdAt } = filter.value;

      if (month) {
        query.month = month;
      }

      if (year) {
        query.year = year;
      }

      if (period) {
        query.period = period;
      }

      if (createdAt) {
        dateValidator.dateParse(query, createdAt)
      }

      const populate_user = await userPopulate.populateWithCyclesBy(user.id, query);

      const { haveNextPage, currentPageExists, totalPages } = await page_info({}, null, size, page, populate_user._cycles);

      let gather_data = [];

      if (currentPageExists) {
        const allCycles = populate_user._cycles
          .slice((page - 1) * size, page * size);

        gather_data = [
          allCycles,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if(!currentPageExists) {
        gather_data = [
          [],
          haveNextPage,
          totalPages,
        ];
      }

      if (count) {
        return res.status(200).json({count: gather_data[0].length});
      };

      logger.info(`${req.user.role} ${req.user.id} fetched all ${user.role} ${populate_user._id} cycles successfully`);
      return res
        .status(200)
        .json({
          allCycles: gather_data[0],
          have_next_page: gather_data[1],
          total_pages: gather_data[2]
        });

    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    }
  };

  /**
   * @async  Get a given user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getUser (req, res) {
    try {
      // validate data
      const { value, error } = requestValidator.GetUser.validate(req.body);

      if (error) {
        throw error;
      };

      const user = await User.findOne({ email: value.email }, this._excluded);
      if (!user) {
        return handleResponse(res, 404, `User with ${value.email} not found`);
      }

      logger.info(`${req.user.role} ${req.user.id} fetched ${user.role} ${user._id} data successfully`);
      return res.status(200).json({ user });
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    }
  };

  /**
   * @async Update a user email.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async updateUser (req, res) {
    try {
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, 'Forbidden');
      }

      // validate params
      const { value, error } = requestValidator.AdminUpdateUser.validate(req.body);

      if (error) {
        throw error;
      };

      const user = await User.findOne({ email: value.oldEmail });
      if (!user) {
        return handleResponse(res, 404, `User with ${value.oldEmail} not found`);
      }

      const updateUser = await User
        .findByIdAndUpdate(
          user.id,
          { email: value.newEmail },
          { new: true }
        );

      const updated = updateUser.email === value.newEmail;
      if (updated) {
        logger.info(`${req.user.role} ${req.user.id} updated ${user.role} ${user._id} email successfully`);
      } else {
        logger.info(`${req.user.role} ${req.user.id} tried to update ${user.role} ${user._id} email failed`);
      }
      return res.status(200).json({ updated: updated });
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    }
  };

  /**
   * @async Delete a given user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deleteUser (req, res) {
    try {
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, 'Forbidden');
      }

      // validate params
      const { value, error } = requestValidator.AdminDeleteUser.validate(req.body);

      if (error) {
        throw error;
      };

      const delUser = await User.findOneAndDelete({ email: value.email });
      if (!delUser) {
        return handleResponse(res, 404, `${value.email} not found`);
      }

      logger.info(`Super Admin ${req.user.id} deleted ${delUser.role} ${delUser._id} successfully`);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
      return handleResponse(res, 500, 'Internal Server Error', error);
    }
  };

  /**
   * @async  View all cycles.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getCycles (req, res) {
    try {
      // validate body
      const { value, error } = requestValidator.AdminGetCycles.validate(req.query);
      if (error) {
        throw error;
      }

      // building filter
      const query = {};
      const { month, year, period, start_date, ovulation, days } = value;

      if (month) {
        query.month = month;
      };

      if (year) {
        query.year = year;
      };

      if(start_date) {
        query.start_date = start_date;
      };

      if(ovulation) {
        query.ovulation = ovulation;
      };

      if(days) {
        query.days = days;
      };

      if(period) {
        query.period = period;
      };

      // if count is true, admin just wants a count of the filtered documents
      if (value.count) {
        const count = await Cycle
          .countDocuments(query);

        logger.info(`${req.user.id} fetched count of cycles data successfully`);
        return res
          .status(200)
          .json({
            count: count,
          });
      }

      const { haveNextPage, currentPageExists, totalPages } = await page_info(query, Collections.Cycle, value.size, value.page);

      let gather_data = [];

      if (currentPageExists) {
        const cycles = await Cycle
          .find({ ...query })
          .skip((value.page - 1) * value.size)
          .limit(value.size)
          .exec();

        gather_data = [
          cycles,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if(!currentPageExists) {
        gather_data = [
          [],
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      logger.info(`${req.user.id} fetched all cycles data successfully`);
      return res
        .status(200)
        .json({
          cycles: gather_data[0],
          have_next_page: gather_data[1],
          total_pages: gather_data[2]
        });

    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
    }
  };

  /**
   * @async Fetch a cycle by ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getCycle(req, res) {
    try {
      const cycleId = req.params.cycleId;

      // Retrieve specific cycle data by ID
      const specificCycleData = await Cycle.findById(cycleId);
      if (!specificCycleData) {
        return handleResponse(res, 404, "Cycle data not found");
      };

      logger.info(`${req.user.id} fetched cycle data successfully`);
      return res.status(200).json({ cycle: specificCycleData });
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			};
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			};
			return handleResponse(res, 500, error.message, error);
    };
  };

  /**
   * @async Delete cycle data.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deleteCycle(req, res) {
    try {
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const cycleIdToDelete = req.params.cycleId;

      // Find and delete specific cycle data by ID
      const deletedCycleData = await Cycle.findByIdAndDelete(cycleIdToDelete);
      if (!deletedCycleData) {
        return handleResponse(res, 404, "Cycle not found");
      }

      logger.info(`${req.user.role} ${req.user.id} deleted cycle data successfully`);
      return res.status(204).send();
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			};
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			};
			return handleResponse(res, 500, error.message, error);
    };
  };

  /**
   * @async Switch admin role.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async switchAdmin(req, res) {
    try {
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const { value, error } = requestValidator.SwitchRole.validate(req.body);
      if (error) {
        throw error;
      }

      let id;
      let email;
      let username;

      const { email_username_id, role } = value;

      if (Types.ObjectId.isValid(email_username_id)) {
        id = await Admin.findById(email_username_id)
      } else {
        [ email, username ] = await Promise.all([
          Admin.findOne({ email: email_username_id}),
          Admin.findOne({ username: email_username_id })
        ]);
      }

      const admin = id || email || username;
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }

      admin.role = role;
      await admin.save();

      logger.info(`Super Admin ${req.user.id} switched admin ${admin._id} to ${role} successfully`);
      return res.status(200).json({ admin });

    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			};
      if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			};
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			};
			return handleResponse(res, 500, error.message, error);
    };
  };

  /**
   * @async Deactivate an admin user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deactivateAdmin(req, res) {
    try {
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const { value, error } = requestValidator.DeactivateAdmin.validate(req.body);
      if (error) {
        throw error;
      }

      let id;
      let email;
      let username;

      const { email_username_id } = value;

      if (Types.ObjectId.isValid(email_username_id)) {
        id = await Admin.findById(email_username_id)
      } else {
        [ email, username ] = await Promise.all([
          Admin.findOne({ email: email_username_id}),
          Admin.findOne({ username: email_username_id })
        ]);
      }

      const admin = id || email || username;
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }


      if (admin.role === Role.super_admin) {
        return handleResponse(res, 400, "Can't deactivate a Super Admin");
      }

      admin.status = userStatus.deactivated;
      await admin.save();

      logger.info(`Super Admin ${req.user.id} deactivated admin with id ${admin._id} successfully`);
      return handleResponse(res, 200, "Admin deactivated");
    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			};
      if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			};
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			};
			return handleResponse(res, 500, error.message, error);
    }
  }
};


const adminController = new AdminController();
module.exports = adminController;
