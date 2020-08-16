"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController.js"),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts"),
  Subscriber = require("./models/subscriber"),
  subscribersController = require("./controllers/subscribersController"),
  mongoose = require("mongoose"),
  chalkAnimation = require('chalk-Animation');

  mongoose.connect(//“assign the database connection to the db variable
    "mongodb://localhost:27017/recipe_db",
    {useNewUrlParser: true}
  );

app.get("/subscribers", subscribersController.getAllSubscribers,
 (req, res, next) => {
  console.log(req.data);
  res.send(req.data);
});

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
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  chalkAnimation.rainbow(
    `----------------------------Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
