const express = require("express");
const controllers = require("../controllers");
const appController = controllers.appController;
const userController = controllers.userController;
const authController = controllers.authController;
const cycleController = controllers.cycleController;

function controllerRouting(app) {
  const router = express.Router();
  app.use("/", router);

  // App controller routes
  router.get("/status", (req, res) => {
    appController.getStatus(req, res);
  });

  router.get("/stats", (req, res) => {
    appController.getStats(req, res);
  });

  // User controller routes
  router.post("/user", (req, res) => {
    userController.postNew(req, res);
  });

  router.get("/user/me", (req, res) => {
    userController.getMe(req, res);
  });

  // Auth controller routes
  router.get("/connect", (req, res) => {
    authController.getConnect(req, res);
  });

  router.get("/disconnect", (req, res) => {
    authController.getDisconnect(req, res);
  });

  // Cycle controller routes
  router.post("/cycle", (req, res) => {
    cycleController.postUpload(req, res);
  });

  router.get("/cycle/:id", (req, res) => {
    cycleController.getShow(req, res);
  });

  router.get("/cycle", (req, res) => {
    cycleController.getIndex(req, res);
  });

  router.put("/cycle/:id/unpublish", (req, res) => {
    cycleController.putUnpublish(req, res);
  });

  router.put("/cycle/:id/publish", (req, res) => {
    cycleController.putPublish(req, res);
  });

  router.get("/cycle/:id/data", (req, res) => {
    cycleController.getCycle(req, res);
  });
}

module.exports = controllerRouting;
