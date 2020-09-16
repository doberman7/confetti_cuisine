const router = require("express").Router(),
  coursesController = require("../controllers/coursesController");//Require courses controller.

router.get("/courses", coursesController.index, coursesController.respondJSON);//Add the API route to the Express.js Router
router.use(coursesController.errorJSON);//Add API error-handling middleware.

module.exports = router;
