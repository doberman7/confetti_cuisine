"use strict";


const express = require("express"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts"),
  Subscriber = require("./models/subscriber"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  mongoose = require("mongoose"),
  chalk = require('chalk'),
  chalkAnimation = require('chalk-animation');

mongoose.Promise = global.Promise;

mongoose.connect(//assign the database connection
  "mongodb://localhost:27017/recipe_db",//Set up the database connection
  {useNewUrlParser: true,
    useUnifiedTopology: true,//this and next line solves 2 warnings, that affects chalk animation
    useCreateIndex: true,
  },
);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(express.static ("public"));//“To enable static assets
router.use(layouts);
router.use(
  express.urlencoded({//tell Express.js app to use body-parser for processing URL encoded and JSON parameters
    extended: false
  })
);
app.use(router);

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Welcome to Confetti Cuisine!");
});

router.get("/users/new", usersController.new);//Handle requests to view the creation form
router.post("/users/create", usersController.create,
  usersController.redirectView);//Handle requests to submit data from the creation form, and display a view

// app.post("/users/create", usersController.create);//from the example code
//app.get("/users/new", usersController.new);//from the example code
router.get("/users", usersController.index, usersController.indexView);

router.get("/subscribers", subscribersController.getAllSubscribers);

router.get("/courses", homeController.showCourses);
router.get("/contact", homeController.showSignUp);
router.post("/contact", homeController.postedSignUpForm);

router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  chalkAnimation.rainbow("-".repeat(8)+
    `----------------------------Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
