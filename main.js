const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController.js"),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts"),
  Subscriber = require("./models/subscriber"),
  subscribersController = require("./controllers/subscribersController"),
  mongoose = require("mongoose"),
  chalk = require('chalk'),
  chalkAnimation = require('chalk-animation');



mongoose.Promise = global.Promise;

mongoose.connect(//“assign the database connection
  "mongodb://localhost:27017/recipe_db",//Set up the database connection
  {useNewUrlParser: true,
    useUnifiedTopology: true,//this and next line solves 2 warnings, that affects chalk animation
    useCreateIndex: true,
  },
);

app.get("/subscribers", subscribersController.getAllSubscribers);

app.use(express.static ("public"));//“To enable static assets

app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");
app.use(layouts);

app.get("/", (req, res) => {
  res.send("Welcome to Confetti Cuisine!");
});

app.use(
  express.urlencoded({//tell Express.js app to use body-parser for processing URL encoded and JSON parameters
    extended: false
  })
);

app.use(express.json());

app.get("/courses", homeController.showCourses);
//app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);


app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);


app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  chalkAnimation.rainbow(
    `----------------------------Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
