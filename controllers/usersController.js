"use strict";


const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    User.find() //Run query in index action only.
      .then(users => {
        res.locals.users = users;//Store the user data on the response and call the next middleware function
          next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);//Catch errors, and pass to the next middleware.
      });
  },
  indexView: (req, res) => {
    res.render("users/index");//Render view in separate action.
  },

  new: (req, res) => {//Add the new action to render a form  NOT WORKING
    res.render("users/new");
  },

  create: (req, res, next) => {//Add the create action to save the user to the database.
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.create(userParams)//Create users with form parameters
      .then(user => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {//Render the view in a separate redirectView action
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let userId = req.params.id;//Collect the user ID from the request params
    let isAnID = mongoose.Types.ObjectId.isValid(userId);//THIS FIX in case no valid ID
    if (isAnID){
      User.findById(userId)//Find a user by its ID.
          .then(user => {
            res.locals.user = user;//Pass the user through the response object to the next middleware function.
              next();
          })
          .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);//
          });
    } else if (userId == "new"){
      console.log("route new NOT WORKING, harcore apprach")
      res.render("users/new");
      }
  },

  showView: (req, res) => {
    res.render("users/show");//Render show view
  }
};
