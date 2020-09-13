const router = require("express").Router(),
  homeController = require("../controllers/homeController");


// may I should coment next 3 lines
router.get("/", homeController.index);
// router.get("/courses", homeController.showCourses);
router.get("/contact", homeController.getSubscriptionPage);

module.exports = router;
