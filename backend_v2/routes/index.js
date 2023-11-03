const express = require("express");
const controllers = require("../controllers");

controllerRouting(app) {
  const router = express.Router();
  app.use("/", router);

  /* app controller 
   * return if redis is alive and if db is alive
   */
  router.get("/status", (req, res) => {
    appController.getStatus(req, res);
  });

  /* return number of users and cycle in db */
  router.get("/stats", (req, res) => {
    appController.getStats(req, res);
  });

  /* userController 
   * create a new user in DB*/

  router.post("user", (req, res) => {
    userController.postNew(req, res);
  });

  /* retrieve user base on the token used */
  router.get("/user/me", (req, res) => {
    userController.getMe(req, res);
  });

  /* Auth controller 
   * sign in the user by generating a new auth token */
  router.get("/connect", (req, res) => {
    authController.getConnect(req, res);
  });

  /* sign out user by generating a new auth token */
  router.get("/disconnect", (req, res) => {
    authController.getDisconnect(req, res);
  });

  /* cycle controller 
   * create a new cycle in DB and redis
   */
  router.post("/cycle", (req, res) => {
    cycleController.postUpload(req, res);
  });

  /* retrieve cycle doc based on ID */
  router.get("/cycle/:id", (req, res) => {
    cycleController.getShow(req, res);
  });

  /* retrieve all users cycle docs for a specific parentId and with pagination */
  router.get("/cycle", (req, res) => {
    cycleController.getIndex(req, res);
  });

  /* set isPublic to false on the cycle based on the ID */
  router.put("/cycle/:id/unpublish", (req, res) => {
    cycleController.putUnpublish(req, res);
  });

  /* set isPublic to true on the cycle based on the ID */
  router.put("/cycle/:id/publish", (req, res) => {
    cycleController.putPublish(req, res);
  });


  /* return the content of the cycle doc based on the ID */
  router.get("/cycle/:id/data", (req, res) => {
    cycleController.getCycle(req, res);
  });
}

module.exports = controllerRouting;
