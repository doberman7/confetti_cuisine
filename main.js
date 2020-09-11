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
  coursesController = require("./controllers/coursesController"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),//Require the method-override module
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  bcrypt = require("bcrypt"),
  expressValidator = require("express-validator"),
  passport = require('passport'),
  User = require("./models/user"),
  chalk = require('chalk'),
  chalkAnimation = require('chalk-animation');


router.use(cookieParser("secret_passcode"));// Configure your Express.js application to use cookie-parser as middleware
router.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,//dont sen a cookie to the user if no messages are added to the session by settinig
  saveUninitialized: false
}));//Configure express-session to use cookie-parser.
router.use(connectFlash());//Configure your application to use connect-flash as middleware

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();//Assign flash messages to the local flashMessages variable on the response object.
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

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



router.use(passport.initialize());//Initialize passport.
router.use(passport.session());//Configure passport to use sessions in Express.js.

passport.use(User.createStrategy());//Configure the user’s login strategy.
passport.serializeUser(User.serializeUser()),//Set up passport to serialize and deserialize your user data.
passport.deserializeUser(User.deserializeUser())

router.use(express.static ("public"));//“To enable static assets
router.use(layouts);
router.use(
  express.urlencoded({//tell Express.js app to use body-parser for processing URL encoded and JSON parameters
    extended: false
  })
);

router.use(methodOverride("_method", {//Configure the application router to use methodOverride as middleware
  methods: ["POST", "GET", "PUT"]
}));

router.use(express.json());

router.use(expressValidator());

router.get("/", homeController.index);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.get("/users/login",  usersController.login);
router.post("/users/login",usersController.authenticate);
// router.post("/users/create", usersController.create,usersController.redirectView);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);//Add routes to handle viewing.
router.put("/users/:id/update", usersController.update, usersController.redirectView);//Process data from the edit form, and display the user show page
router.delete ("/users/:id/delete", usersController.delete, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create,subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);//Add routes to handle viewing.
router.put("/subscribers/:id/update", subscribersController.update,
 subscribersController.redirectView);//Process data from the edit form, and display the user show page
router.delete ("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView)
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

// router.get("/courses", homeController.showCourses);

// router.get("/contact", subscribersController.getSubscriptionPage);
// router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);


app.listen(app.get("port"), () => {
  chalkAnimation.rainbow("-".repeat(8)+
    `Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
