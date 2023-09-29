const bcrypt = require('bcryptjs');
const Admin = require('../model/admin.model');
const Cycle = require('../../models/cycle.model');
const { handleResponse } = require('../../utility/handle.response');
const adminController = {
  /* create new admin */
  createAdmin: async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.isAdmin || !req.session.user.isSuperAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      const { email, password, username, isAdmin } = req.body;

      /*Hash the password before saving it*/
      const saltRounds = 12;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      //const hashedPassword = bcrypt.hashSync(password, 10);

      /*Create a new admin*/
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
        username,
        isAdmin,
      });

      await newAdmin.save();

      res.send('New admin created successfully');
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  /* Delete admin */
  deleteAdmin: async (req, res) => {
    try {
      
      if (!req.session.user || !req.session.user.isAdmin || !req.session.user.isSuperAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      const adminIdToDelete = req.params.adminId;

      // Find and delete the admin
      const deletedAdmin = await Admin.findByIdAndDelete(adminIdToDelete);

      if (deletedAdmin) {
        res.send('Admin deleted successfully');
      } else {
        handleResponse(res, 404, "Admin not found");
      }
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "internal Server error");
    }
  },

  // View all cycle data
  viewAllCycleData: async (req, res) => {
    try {
      
      if (!req.session.user || !req.session.user.isAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      // Retrieve all cycle data
      const allCycleData = await Cycle.find();
      res.json(allCycleData);
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  // View specific cycle data
  viewSpecificCycleData: async (req, res) => {
    try {
      
      if (!req.session.user || !req.session.user.isAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      const cycleId = req.params.cycleId;

      // Retrieve specific cycle data by ID
      const specificCycleData = await Cycle.findById(cycleId);
      if (!specificCycleData) {
        return handleResponse(res, 404, "Cycle data not found");
      }

      res.json(specificCycleData);
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  // Edit cycle data
  editCycleData: async (req, res) => {
    try {
      
      if (!req.session.user || !req.session.user.isAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      const cycleId = req.params.cycleId;
      const updatedData = req.body;

      // Find and update specific cycle data by ID
      const updatedCycleData = await Cycle.findByIdAndUpdate(cycleId, updatedData, { new: true });
      if (!updatedCycleData) {
        return handleResponse(res, 404, "Data not found");
      }

      res.json(updatedCycleData);
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

  // Delete cycle data
  deleteCycleData: async (req, res) => {
    try {
      
      if (!req.session.user || !req.session.user.isAdmin) {
        return handleResponse(res, 403, "Forbidden");
      }

      const cycleIdToDelete = req.params.cycleId;

      // Find and delete specific cycle data by ID
      const deletedCycleData = await Cycle.findByIdAndDelete(cycleIdToDelete);
      if (!deletedCycleData) {
        return handleResponse(res, 404, "Data not found");
      }

      res.send('Cycle data deleted successfully');
    } catch (error) {
      console.error(error);
      handleResponse(res, 500, "Internal server error");
    }
  },

};

module.exports = adminController;
