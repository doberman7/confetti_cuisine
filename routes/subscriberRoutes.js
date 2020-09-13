const router = require("express").Router(),
  subscribersController = require("../controllers/subscribersController");

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create,subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);//Add routes to handle viewing.
router.put("/subscribers/:id/update", subscribersController.update,
 subscribersController.redirectView);//Process data from the edit form, and display the user show page
router.delete ("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView)
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

module.exports = router;
