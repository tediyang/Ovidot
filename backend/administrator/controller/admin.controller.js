const bcrypt = require('bcryptjs');
const Admin = require('../model/admin.model');
const Cycle = require('../../models/cycle.model');
const User = require('../../models/user.model');
const { handleResponse } = require('../../utility/handle.response');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const secretKey = process.env.ADMINKEY;

// Generate token
function createToken(user) {
  return jwt.sign({ id: user._id, admin: user.is_admin }, secretKey, { expiresIn: '1h' });
}

/**
 * Admin Controller
 * @module AdminController
 */
const adminController = {
  /**
   * Admin login.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  login: async (req, res) => {
    const { username, password } = req.body;

    // validate params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, 400, "Fill required properties");
    }

    const user = await Admin.findOne({ username: username });

    if (!user) {
      return handleResponse(res, 404, `${username} doesn't exist`);
    }

    const matched = await bcrypt.compare(password, user.password);
    try {
      if (matched) {
        const token = createToken(user);
        res.status(200).json({
          message: 'Authentication successful',
          token
        });
      } else {
        return handleResponse(res, 401, 'Authentication failed');
      }
    } catch (error) {
      console.error(error);
      return handleResponse(res, 500, 'Internal Server Error');
    }
  },

  /**
   * Get all users.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  viewAllusers: async (req, res) => {
    try {
      const allUsers = await User.find({}, '-password -reset -resetExp -__v');
      return res.status(200).json({ allUsers });
    } catch (error) {
      console.log(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * Get user.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  viewUser: async (req, res) => {
    try {
      // validate params
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, 400, "Fill required properties");
      }

      const user = await User.findOne({ email: req.body.email }, '-password -reset -resetExp -__v');
      if (!user) {
        return handleResponse(res, 404, `User with ${req.body.email} not found`);
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * Update user email.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  updateUser: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      // validate the params
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, 400, "Fill required properties");
      }

      const user = await User.findOne({ email: req.body.oldEmail }, '-password -reset -resetExp -__v');
      if (!user) {
        return handleResponse(res, 404, `User with ${req.body.oldEmail} not found`);
      }
      const updateUser = await User.findByIdAndUpdate(user.id,
        { email: req.body.newEmail },
        { new: true });

      const updated = updateUser.email === req.body.newEmail;
      return res.status(200).json({ updated: updated });
    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, 'Internal Server Error');
    }
  },

  /**
   * Delete user.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  deleteUser: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      // validate params
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, 400, "Fill required properties");
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return handleResponse(res, 404, `${req.body.email} not found`);
      }
      const delUser = await User.findByIdAndDelete(user.id);
      if (!delUser) {
        return handleResponse(res, 404, "User not found");
      }

      return res.status(204).send(`${req.body.email} deleted`);
    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, 'Internal Server Error');
    }
  },

  /**
   * View all cycles.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  viewAllCycles: async (req, res) => {
    try {
      const allCycleData = await Cycle.find({});
      return res.status(200).json({ allCycleData });
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * Fetch a cycle by ID.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  viewCycle: async (req, res) => {
    try {
      const cycleId = req.params.cycleId;

      // Retrieve specific cycle data by ID
      const specificCycleData = await Cycle.findById(cycleId);
      if (!specificCycleData) {
        return handleResponse(res, 404, "Cycle data not found");
      }

      return res.status(200).json({ specificCycleData });
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  /**
   * Delete cycle data.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   * @throws {Object} - Error response object.
   */
  deleteCycle: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const cycleIdToDelete = req.params.cycleId;

      // Find and delete specific cycle data by ID
      const deletedCycleData = await Cycle.findByIdAndDelete(cycleIdToDelete);
      if (!deletedCycleData) {
        return handleResponse(res, 404, "Data not found");
      }

      res.status(204).send('Cycle data deleted successfully');
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },
};

module.exports = adminController;
