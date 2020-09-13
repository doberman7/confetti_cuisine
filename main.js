"use strict";

const express = require("express"),
  app = express(),
  // router = express.Router(),
  router = require("./routes/index"),
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

router.use(methodOverride("_method", {//Configure the application router to use methodOverride as middleware
  methods: ["POST", "GET", "PUT"]
}));

router.use(express.json());

router.use(expressValidator());

router.use(passport.initialize());//Initialize passport.
router.use(passport.session());//Configure passport to use sessions in Express.js.
passport.use(User.createStrategy());//Configure the user’s login strategy.
passport.serializeUser(User.serializeUser()),//Set up passport to serialize and deserialize your user data.
passport.deserializeUser(User.deserializeUser())
router.use(connectFlash());//Configure your application to use connect-flash as middleware, needs to be continuous to below lines


router.use((req, res, next) => {//With this middleware function, I have access to loggedIn to determine whether an account is logged in via the client from which the request was sent.
  res.locals.loggedIn = req.isAuthenticated();//need to be below conect.flash(), isAuthenticated tells me whether there’s an active session for a user
  res.locals.currentUser = req.user;//currentUser is set to the user who’s logged in if that user exists.
  res.locals.flashMessages = req.flash();//Assign flash messages to the local flashMessages variable on the response object.
  next();
});

router.get("/", homeController.index);

// router.get("/courses", homeController.showCourses);
router.get("/contact", homeController.getSubscriptionPage);


app.use("/", router);


app.listen(app.get("port"), () => {
  chalkAnimation.rainbow("-".repeat(8)+
    `Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
