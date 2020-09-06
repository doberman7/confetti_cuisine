"use strict";

const User = require("../models/user"),
  mongoose = require("mongoose"),
  chalkAnimation = require('chalk-animation'),
  getUserParams = (body) => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

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
    res.render("users/index",{
      flashMessages: {
        success: "Loaded all users!"
      }
    });
  },

  new: (req, res) => {//Add the new action to render a form  NOT WORKING
    res.render("users/new");
  },

  create: (req, res, next) => {//Add the create action to save the user to the database.
    let userParams = getUserParams(req.body);
    User.create(userParams)//Create users with form parameters
      .then(user => {
        req.flash("successUser", `${user.fullName}'s account created successfully!`);//Respond with a success flash message.
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
            console.log(`Error saving user: ${error.message}`);
            res.locals.redirect = "/users/new";
            req.flash(
              "error",
              `Failed to create user account because:  ${error.message}.`
            );
            next();
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
      console.log("route new NOT WORKING, harcore approach")
      res.render("users/new");
      }
  },

  showView: (req, res) => {
    res.render("users/show");//Render show view
  },

  edit: (req, res, next) => {//Add the edit action.
  let userId = req.params.id;
  User.findById(userId)//Use findById to locate a user in the database by their ID
      .then(user => {
        res.render("users/edit", {
          user: user//?
        });//Render the user edit page for a specific user in the database
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {//Add the update action.
    mongoose.set('useFindAndModify', false);//this turn off depraction warning
    console.log("update")
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };//Collect user parameters from reques

    User.findByIdAndUpdate(userId, {
      $set: userParams
    })//Use findByIdAndUpdate to locate a user by ID and update the document record in one command.
        .then(user => {
          res.locals.redirect = `/users/${userId}`;
          res.locals.user = user;
          next();//Add user to response as a local variable, and call the next middleware function
        })
        .catch(error => {
          console.log(`Error updating user by ID: ${error.message}`);
          next(error);
        });
  },

  delete: (req, res, next) => {
  let userId = req.params.id;
  mongoose.set('useFindAndModify', false);//this turn off depraction warning
  User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  login: (req, res) => {//Add the login action
    // chalkAnimation.rainbow("login runs"),
    res.render("users/login");
  },

  authenticate: (req, res, next) => {//Add the login action
    User.findOne({
      email: req.body.email
    })//Compare the form password with the database password.
        .then(user => {
          if (user && user.password === req.body.password){
            res.locals.redirect = `/users/${user._id}`;
            req.flash("success", `${user.fullName}'s logged in successfully!`);
            res.locals.user = user;
            next();
      } else {
        req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
        res.locals.redirect = "/users/login";
        next();
      }
    })
        .catch(error => {//Log errors to the console, and redirect
          console.log(`Error logging in user: ${error.message}`);
          next(error);
        });
  }
};
