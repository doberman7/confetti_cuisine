"use strict";

const port = 3000,
  express = require ("express"),
  app = express(),
  homeController = require("./controllers/homeController.js"),
  chalkAnimation = require('chalk-Animation'),
  errorController = require("./controllers/errorController.js"),
  layouts = require("express-ejs-layouts");

//set port to the environment variable..
//..PORT value or 3000 if the former value is undefined
app.set("port", process.env.PORT || 3000);

//use for template ejs
app.set("view engine", "ejs");

//This route runs when a request is made to the /name path; then it calls the respondWithName function in the home controller
app.get("/name/:myName", homeController.respondWithName);
//middleware
app.use(express.static("public"));
app.use(layouts);
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port ,() => {
  chalkAnimation.rainbow(`Server running at http://localhost:${ app.get("port") }`);
});
