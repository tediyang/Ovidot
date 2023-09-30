const bcrypt = require('bcryptjs');
const Admin = require('../model/admin.model');
const Cycle = require('../../models/cycle.model');
const User = require('../../models/user.model');
const { handleResponse } = require('../../utility/handle.response');
const { validationResult } = require('express-validator');

const secretKey = process.env.ADMINKEY;

// Generate token
function createToken(user) {
  return jwt.sign({ id: user._id, admin: user.is_admin }, secretKey, { expiresIn: '1h' });
}

// admin controller
const adminController = {
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
            adminId: user._id,
            token});
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
   * @param {Object} req 
   * @param {Object} res 
   * @returns 
   */
  viewAllusers: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const allUsers = await User.find({},
        '-password -created_at -updated_at -is_admin -reset -resetExp');
      return res.status(200).json( { allUsers });
    } catch (error) {
      console.log(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * Get user
   * @param {Object} req 
   * @param {Object} res 
   * @returns 
   */
  viewUser: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const user = await User.findOne({ email: req.params.email},
        '-password -created_at -updated_at -is_admin -reset -resetExp');
      if (!user) {
        return handleResponse(res, 404, `user with ${req.params.email} not found`);
      }
      return res.status(200).json({ user })
    } catch (error) {
      console.log(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * Update user email
   * @param {Object} req 
   * @param {Object} res 
   * @returns 
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

      const user = await User.findOne({ email: req.params.email },
        '-password -created_at -updated_at -is_admin -reset -resetExp');
      if (!user) {
        return handleResponse(res, 404, `user with ${req.params.email} not found`);
      }
      const updateUser = await User.findByIdAndUpdate(user.id,
        { email: req.body.email },
        { new: true });

      const updated = updateUser.email === req.body.email;
      return res.status(200).json({ updated: updated});
    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, 'Internal Server Error');
    }
  },

  deleteUser: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const user = await User.findOne({ email: req.params.email });
      if (!user) {
        return handleResponse(res, 404, "User not found");
      }
      const delUser = await user.findByIdAndDelete(user.id);
      if (!delUser) {
        return handleResponse(res, 404, "User not found");
      }

      return res.status(204).send('User deleted');
    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, 'Internal Server Error');
    }
  },

  /**
   * View all cycles.
   * @param {Object} req
   * @param {Object} res
   * @returns 
   */
  viewAllCycles: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const allCycleData = await Cycle.find({},
        '-created_at -updated_at');
      return res.status(200).json({ allCycleData });
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal Server Error");
    }
  },

  /**
   * fetch a cycle by Id
   * @param {Object} req 
   * @param {Object} res 
   * @returns 
   */
  viewCycle: async (req, res) => {
    try {
      if (!req.user.admin) {
        return handleResponse(res, 403, 'Forbidden');
      }

      const cycleId = req.params.cycleId;

      // Retrieve specific cycle data by ID
      const specificCycleData = await Cycle.findById(cycleId,
        '-created_at -updated_at');
      if (!specificCycleData) {
        return handleResponse(res, 404, "Cycle data not found");
      }

      return res.status(200).json({ specificCycleData });
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  // Delete cycle data
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
