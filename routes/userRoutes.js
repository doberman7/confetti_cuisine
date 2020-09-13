const router = require("express").Router(),
  usersController = require("../controllers/usersController");

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.get("/users/login",  usersController.login);
router.post("/users/login",usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.post("/users/create", usersController.validate, usersController.logEmail, usersController.create, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);//Add routes to handle viewing.
router.put("/users/:id/update", usersController.update, usersController.redirectView);//Process data from the edit form, and display the user show page
router.delete ("/users/:id/delete", usersController.delete, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

module.exports = router;
