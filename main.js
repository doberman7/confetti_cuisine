"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController.js"),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  db = mongoose.connection,
  subscriberSchema = mongoose.Schema({
    name: String,
    email: String,
    zipCode: Number
  }),
  Subscriber = mongoose.model("Subscriber", subscriberSchema),
  chalkAnimation = require('chalk-Animation');

var subscriber1 = new Subscriber({
  name: "Jon Wexler",
  email: "jon@jonwexler.com"
});

subscriber1.save((error, savedDocument) => {
  if (error) console.log(error);
  console.log(savedDocument);
});

Subscriber.create(
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com"
  },
  function (error, savedDocument) {
    if (error) console.log(error);
    console.log(savedDocument);
  }
);

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
),

db.once("open", () => {
  chalkAnimation.rainbow("Successfully connected to MongoDB using Mongoose!");
});

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
