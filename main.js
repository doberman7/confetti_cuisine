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

app.use(router);//alow the router prefix. instead of app.

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(express.static ("public"));//“To enable static assets
router.use(layouts);
router.use(
  express.urlencoded({//tell Express.js app to use body-parser for processing URL encoded and JSON parameters
    extended: false
  })
);


router.use(express.json());

router.get("/", (req, res) => {
  res.send("Welcome to Confetti Cuisine!");
});

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create,usersController.redirectView);

router.get("/users/:id", usersController.show, usersController.showView);

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
