const router = require("express").Router(),
  usersController = require("../controllers/usersController");

// router.get("/users", usersController.index, usersController.indexView);
router.get("/", usersController.index, usersController.indexView);

router.get("/new", usersController.new);
router.get("/login",  usersController.login);
router.post("/login",usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);
router.post(
  "/create",
  usersController.validate,
  usersController.logEmail,
  usersController.create,
  usersController.redirectView);
router.get("/:id/edit", usersController.edit);//Add routes to handle viewing.
router.put("/users/:id/update", usersController.update, usersController.redirectView);//Process data from the edit form, and display the user show page
router.delete ("/:id/delete", usersController.delete, usersController.redirectView);
router.get("/:id", usersController.show, usersController.showView);

module.exports = router;
