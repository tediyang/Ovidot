const {
  Admin,
  Cycle,
  User,
  page_info,
  MongooseError,
} = require("../../models/engine/database");
const handleResponse = require("../../utility/helpers/handle.response");
const userPopulate = require("../../utility/helpers/user.populate");
const requestValidator = require("../../utility/validators/requests.validator.js");
const dateValidator = require("../../utility/validators/date.validator");
const { encryptText } = require("../../utility/encryption/encryption");
const { Role, userStatus, Collections } = require("../../enums");
const { logger } = require("../../middleware/logger");
const blacklist = require("../../middleware/tokenBlacklist");
const Joi = require("joi");
const { Types } = require("mongoose");
const { sign, JsonWebTokenError } = require("jsonwebtoken");
const util = require("../../utility/encryption/cryptography");
require("dotenv").config();


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
    return sign({ id: admin._id, role: admin.role, username: admin.username }, this._secretKey, {
      expiresIn: "1h",
    });
  }

  /**
   * @async Logout an admin user.
   * Blacklists the current token. Admins have no refresh token to clear.
   */
  async logout(req, res) {
    try {
      let token = req.header("Authorization");
      if (token) {
        token = token.substring(7);
        blacklist.updateBlacklist(token);
        logger.info(`Admin ${req.user.id} logged out at ${new Date()}`);
      }
      return handleResponse(res, 200, "Logout Successful");
    } catch (error) {
      if (error instanceof MongooseError) {
        return handleResponse(res, 500, "We have a mongoose problem", error);
      }
      if (error instanceof JsonWebTokenError) {
        return handleResponse(res, 500, error.message, error);
      }
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * @async Login an admin user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async login(req, res) {
    try {
      const { value, error } = requestValidator.AdminLogin.validate(req.body);

      if (error) {
        throw error;
      }

      // validate email/username

      const [username, email] = await Promise.all([
        Admin.findOne({ username: value.email_or_username }),
        Admin.findOne({ email: value.email_or_username }),
      ]);

      const admin = username || email;
      if (!admin) {
        return handleResponse(
          res,
          400,
          "email, username or password incorrect",
        );
      }

      if (admin.status === userStatus.deactivated) {
        return handleResponse(
          res,
          400,
          "Account deactivated - Contact your super administrator",
        );
      }
      const matched = await util.validate_encryption(value.password, admin.password);
      if (matched) {
        const token = this.createToken(admin);

        // reset trials
        admin.loginAttempts = 0;
        await admin.save();

        logger.info(
          `${admin.role} ${admin._id} logged in successfully at ${new Date()}`,
        );
        return res.status(200).json({
          message: "Authentication successful",
          token,
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
        return handleResponse(
          res,
          400,
          "email, username or password incorrect",
        );
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
    }
  }

  /**
   * @async Get all users.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns
   * @throws {Object} - Error response object.
   */
  async getUsers(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      // validate body
      const { value, error } = requestValidator.GetUsers.validate(req.query);
      if (error) {
        throw error;
      }

      // building filter
      const query = {};
      const { fname, lname, username, dob, role, createdAt, period, status } =
        value;

      if (fname) {
        query["name.fname"] = fname.toLowerCase();
      }

      if (lname) {
        query["name.lname"] = lname.toLowerCase();
      }

      if (username) {
        query.username = username.toLowerCase();
      }

      if (dob) {
        query.dob = dob;
      }

      if (role) {
        query.role = role;
      }

      if (status) {
        query.status = status;
      }

      if (period) {
        query.period = period;
      }

      if (createdAt) {
        dateValidator.dateParse(query, createdAt);
      }

      // if count is true, admin just wants a count of the filtered documents
      if (value.count) {
        const count = await User.countDocuments(query);

        logger.info(
          `${req.user.role} ${req.user.id} fetched the count of users data successfully`,
        );
        return res.status(200).json({
          count: count,
        });
      }

      const { haveNextPage, currentPageExists, totalPages } = await page_info(
        query,
        Collections.User,
        value.size,
        value.page,
      );

      let gather_data = [];

      if (currentPageExists) {
        const users = await User.find({ ...query }, this._excluded)
          .skip((value.page - 1) * value.size)
          .limit(value.size)
          .sort({ createdAt: -1 })
          .lean()
          .exec();

        gather_data = [
          users,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if (!currentPageExists) {
        gather_data = [
          [],
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      logger.info(
        `${req.user.role} ${req.user.id} fetched all users data successfully`,
      );
      return res.status(200).json({
        users: gather_data[0],
        have_next_page: gather_data[1],
        total_pages: gather_data[2],
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
  }

  /**
   * Return all the cycle for a given user.
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns
   */
  async getUserCycles(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      const { value, err } = requestValidator.GetUserCycles[0].validate(
        req.body,
      );
      if (err) {
        throw err;
      }

      const filter = requestValidator.GetUserCycles[1].validate(req.query);
      if (filter.error) {
        throw filter.error;
      }

      const user = await User.findOne(
        { email: value.email },
        { _id: 1, role: 1 },
      ).lean();
      if (!user) {
        return handleResponse(res, 404, `User with ${value.email} not found`);
      }

      // building filter
      const query = {};
      const { count, month, year, period, size, page, createdAt } =
        filter.value;

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
        dateValidator.dateParse(query, createdAt);
      }

      const populate_user = await userPopulate.populateWithCyclesBy(
        user._id,
        query,
      );

      const { haveNextPage, currentPageExists, totalPages } = await page_info(
        {},
        null,
        size,
        page,
        populate_user._cycles,
      );

      let gather_data = [];

      if (currentPageExists) {
        const allCycles = populate_user._cycles.slice(
          (page - 1) * size,
          page * size,
        );

        gather_data = [
          allCycles,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if (!currentPageExists) {
        gather_data = [[], haveNextPage, totalPages];
      }

      if (count) {
        return res.status(200).json({ count: gather_data[0].length });
      }

      logger.info(
        `${req.user.role} ${req.user.id} fetched all ${user.role} ${populate_user._id} cycles successfully`,
      );
      return res.status(200).json({
        allCycles: gather_data[0],
        have_next_page: gather_data[1],
        total_pages: gather_data[2],
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
  }

  /**
   * @async  Get a given user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getUser(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }
    
      // validate data
      const { value, error } = requestValidator.GetUser.validate(req.body);

      if (error) {
        throw error;
      }

      const user = await User.findOne(
        { email: value.email },
        this._excluded,
      ).lean();
      if (!user) {
        return handleResponse(res, 404, `User with ${value.email} not found`);
      }

      logger.info(
        `${req.user.role} ${req.user.id} fetched ${user.role} ${user._id} data successfully`,
      );
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
  }

  /**
   * @async Update a user email.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async updateUser(req, res) {
    try {
        // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      // validate params
      const { value, error } = requestValidator.AdminUpdateUser.validate(
        req.body,
      );

      if (error) {
        throw error;
      }

      const user = await User.findOne(
        { email: value.oldEmail },
        { _id: 1, role: 1 },
      ).lean();
      if (!user) {
        return handleResponse(
          res,
          404,
          `User with ${value.oldEmail} not found`,
        );
      }

      const updateUser = await User.findByIdAndUpdate(
        user._id,
        { email: value.newEmail },
        { new: true },
      );

      const updated = updateUser.email === value.newEmail;
      if (updated) {
        logger.info(
          `${req.user.role} ${req.user.id} updated ${user.role} ${user._id} email successfully`,
        );
      } else {
        logger.info(
          `${req.user.role} ${req.user.id} tried to update ${user.role} ${user._id} email failed`,
        );
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
  }

  /**
   * @async Delete a given user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deleteUser(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      // validate params
      const { value, error } = requestValidator.AdminDeleteUser.validate(
        req.body,
      );

      if (error) {
        throw error;
      }

      const delUser = await User.findOneAndDelete({ email: value.email });
      if (!delUser) {
        return handleResponse(res, 404, `${value.email} not found`);
      }

      logger.info(
        `Super Admin ${req.user.id} deleted ${delUser.role} ${delUser._id} successfully`,
      );
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
      return handleResponse(res, 500, "Internal Server Error", error);
    }
  }

  /**
   * @async  View all cycles.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getCycles(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      // validate body
      const { value, error } = requestValidator.AdminGetCycles.validate(
        req.query,
      );
      if (error) {
        throw error;
      }

      // building filter
      const query = {};
      const { month, year, period, start_date, ovulation, days } = value;

      if (month) {
        query.month = month;
      }

      if (year) {
        query.year = year;
      }

      if (start_date) {
        query.start_date = encryptText(start_date);
      }

      if (ovulation) {
        query.ovulation = encryptText(ovulation);
      }

      if (days) {
        query.days = days;
      }

      if (period) {
        query.period = period;
      }

      // if count is true, admin just wants a count of the filtered documents
      if (value.count) {
        const count = await Cycle.countDocuments(query);

        logger.info(`${req.user.id} fetched count of cycles data successfully`);
        return res.status(200).json({
          count: count,
        });
      }

      const { haveNextPage, currentPageExists, totalPages } = await page_info(
        query,
        Collections.Cycle,
        value.size,
        value.page,
      );

      let gather_data = [];

      if (currentPageExists) {
        const cycles = await Cycle.find({ ...query })
          .skip((value.page - 1) * value.size)
          .limit(value.size)
          .exec();

        gather_data = [
          cycles,
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      if (!currentPageExists) {
        gather_data = [
          [],
          haveNextPage, //have next page
          totalPages, //total pages
        ];
      }

      logger.info(`${req.user.id} fetched all cycles data successfully`);
      return res.status(200).json({
        cycles: gather_data[0],
        have_next_page: gather_data[1],
        total_pages: gather_data[2],
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
  }

  /**
   * @async Fetch a cycle by ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getCycle(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      const cycleId = req.params.cycleId;

      // Retrieve specific cycle data by ID
      const specificCycleData = await Cycle.findById(cycleId);
      if (!specificCycleData) {
        return handleResponse(res, 404, "Cycle data not found");
      }

      logger.info(`${req.user.id} fetched cycle data successfully`);
      return res.status(200).json({ cycle: specificCycleData });
    } catch (error) {
      if (error instanceof MongooseError) {
        return handleResponse(res, 500, "We have a mongoose problem", error);
      }
      if (error instanceof JsonWebTokenError) {
        return handleResponse(res, 500, error.message, error);
      }
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * @async Delete cycle data.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deleteCycle(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      const cycleIdToDelete = req.params.cycleId;

      // Find and delete specific cycle data by ID
      const deletedCycleData = await Cycle.findByIdAndDelete(cycleIdToDelete);
      if (!deletedCycleData) {
        return handleResponse(res, 404, "Cycle not found");
      }

      logger.info(
        `${req.user.role} ${req.user.id} deleted cycle data successfully`,
      );
      return res.status(204).send();
    } catch (error) {
      if (error instanceof MongooseError) {
        return handleResponse(res, 500, "We have a mongoose problem", error);
      }
      if (error instanceof JsonWebTokenError) {
        return handleResponse(res, 500, error.message, error);
      }
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * @async Create a new admin account.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async createAdmin(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      const { value, error } = requestValidator.CreateAdmin.validate(req.body);
      if (error) {
        throw error;
      }

      if (value.role === Role.super_admin) {
        return handleResponse(
          res,
          400,
          "Only ADMIN role is allowed for new admins",
        );
      }

      const existingAdmin = await Admin.findOne({
        $or: [{ email: value.email }, { username: value.username }],
      });
      if (existingAdmin) {
        return handleResponse(res, 409, "Admin username or email already exists");
      }

      const hashedPassword = await util.encrypt(value.password);
      const admin = await Admin.create({
        email: value.email,
        username: value.username ?? null,
        password: hashedPassword,
        role: value.role || Role.admin,
        status: userStatus.active,
        changePasswordRequired: true,
      });

      logger.info(
        `Super Admin ${req.user.id} created ${admin.role} ${admin._id} successfully`,
      );
      return res.status(201).json({
        message: "Admin created successfully",
        admin: {
          email: admin.email,
          password: value.password,
        },
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
  }

  /**
   * @async Delete an admin account.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deleteAdmin(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      const { adminId } = req.params;

      // Prevent super admin from deleting his account
      if (adminId === req.user.id) {
        return handleResponse(res, 403, "Admin cannot delete it own self");
      }

      const admin = await Admin.findByIdAndRemove(adminId);
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }

      logger.info(
        `Super Admin ${req.user.id} deleted ${admin.role} ${admin._id} successfully`,
      );
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
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * @async Get all admins.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express reery,sponse object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async getAdmins(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      const { value, error } = requestValidator.GetAdmins.validate(req.query);
      if (error) {
        throw error;
      }

      // building filter
      const query = {};
      const { username, role, status } =
        value;

      if (username) {
        query.username = username.toLowerCase();
      }

      if (role) {
        query.role = role;
      }

      if (status) {
        query.status = status;
      }  

      const { haveNextPage, currentPageExists, totalPages } = await page_info(
        query,
        Collections.Admin,
        value.size,
        value.page,
      );

      let gather_data = [];

      if (currentPageExists) {
        const admins = await Admin.find(query, { password: 0 })
          .skip((value.page - 1) * value.size)
          .limit(value.size)
          .sort({ createdAt: -1 })
          .lean()
          .exec();

        gather_data = [admins, haveNextPage, totalPages];
      }

      if (!currentPageExists) {
        gather_data = [[], haveNextPage, totalPages];
      }

      logger.info(
        `Super Admin ${req.user.id} fetched all admins data successfully`,
      );
      return res.status(200).json({
        admins: gather_data[0],
        have_next_page: gather_data[1],
        total_pages: gather_data[2],
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
  }

  async changeAdminPassword(req, res) {
    try {
      const { value, error } = requestValidator.ChangeAdminPassword.validate(
        req.body,
      );
      if (error) {
        throw error;
      }

      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }

      // check if the current password matches the stored password
      const isMatch = await util.validate_encryption(value.currentPassword, admin.password);
      if (!isMatch) {
        return handleResponse(res, 400, "Current password is incorrect");
      }

      const hashedPassword = await util.encrypt(value.newPassword);
      admin.password = hashedPassword;

      // change update the loginAttempts to 0 after successful password change
      admin.loginAttempts = 0;
      admin.changePasswordRequired = false;
      await admin.save();

      logger.info(
        `${admin.role} ${req.user.id} changed password successfully`,
      );
      return res.status(200).json({ message: "Password changed successfully" });
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
  }

  /**
   * @async Switch admin role.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async switchAdmin(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
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
        id = await Admin.findById(email_username_id);
      } else {
        [email, username] = await Promise.all([
          Admin.findOne({ email: email_username_id }),
          Admin.findOne({ username: email_username_id }),
        ]);
      }

      const admin = id || email || username;
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }

      // admin cannot switch their own role
      if (admin._id.equals(req.user.id) || admin.email === req.user.email || admin.username === req.user.username) {
        return handleResponse(res, 400, "You cannot switch your own role");
      }

      const previousRole = admin.role;
      if (previousRole === role) {
        return handleResponse(res, 400, "Admin already has this role");
      }

      admin.role = role;
      await admin.save();

      logger.info(
        `Super Admin ${req.user.id} switched ${previousRole} ${admin._id} to ${role} successfully`,
      );
      return res.status(200).json({ admin });
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
  }

  /**
   * @async Deactivate an admin user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  async deactivateAdmin(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }
      
      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      const { value, error } = requestValidator.DeactivateAdmin.validate(
        req.body,
      );
      if (error) {
        throw error;
      }

      let id;
      let email;
      let username;

      const { email_username_id } = value;

      if (Types.ObjectId.isValid(email_username_id)) {
        id = await Admin.findById(email_username_id);
      } else {
        [email, username] = await Promise.all([
          Admin.findOne({ email: email_username_id }),
          Admin.findOne({ username: email_username_id }),
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
      admin.changeAdminPasswordRequired = true;
      await admin.save();

      logger.info(
        `Super Admin ${req.user.id} deactivated ${admin.role} ${admin._id} successfully`,
      );
      return handleResponse(res, 200, "Admin deactivated");
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
  }

  async activateAdmin(req, res) {
    try {
      // check if admin hasn't changed password, they cannot create another admin
      if (req.user.changePasswordRequired) {
        return handleResponse(
          res,
          403,
          "You must change your password before performing such action",
        );
      }

      if (Role.super_admin !== req.user.role) {
        return handleResponse(res, 403, "Forbidden");
      }

      const { value, error } = requestValidator.ActivateAdmin.validate(
        req.body,
      );
      if (error) {
        throw error;
      }

      let id;
      let email;
      let username;

      const { email_username_id } = value;

      if (Types.ObjectId.isValid(email_username_id)) {
        id = await Admin.findById(email_username_id);
      } else {
        [email, username] = await Promise.all([
          Admin.findOne({ email: email_username_id }),
          Admin.findOne({ username: email_username_id }),
        ]);
      }

      const admin = id || email || username;
      if (!admin) {
        return handleResponse(res, 404, "Admin not found");
      }

      admin.status = userStatus.active;
      await admin.save();

      logger.info(
        `Super Admin ${req.user.id} activated ${admin.role} ${admin._id} successfully`,
      );
      return handleResponse(res, 200, "Admin activated");
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
  }
}

const adminController = new AdminController();
module.exports = adminController;
