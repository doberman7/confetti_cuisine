"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController.js"),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts"),
  chalkAnimation = require('chalk-Animation');

app.use(express.static ("public"));
//set port to the environment variable..
//..PORT value or 3000 if the former value is undefined
app.set("port", process.env.PORT || 3000);
//use engine ejs and layout
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
    `Server running at http://localhost:${app.get(
      "port"
    )}`
  );
});
