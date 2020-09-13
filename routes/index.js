const router = require("express").Router(),             
  userRoutes = require("./userRoutes"),//2 Require all the route modules within the same directory.
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes");

router.use("/users", userRoutes);//Use the routes from the relative route modules with namespaces.
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;//Export the router from index.js.
