"use strict";

const User = require("../models/user"),
  passport = require('passport'),
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
    res.render("users/index");
  },

  new: (req, res) => {//Add the new action to render a form  NOT WORKING
    res.render("users/new");
  },

  create: (req, res, next) => {
    if (req.skip) next();

    let newUser = new User( getUserParams(req.body) );

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`);
          res.locals.redirect = "/users";
          next();
        } else {
          req.flash("error", `Failed to create user account because:
            ${error.message}.`);
          res.locals.redirect = "/users/new";
          next();
        }
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
    chalkAnimation.neon("update");
    mongoose.set('useFindAndModify', false);//this turn off depraction warning
    let userId = req.params.id,
      userParams = getUserParams(req.body);

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
    chalkAnimation.glitch("delete");
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

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  validate: (req, res, next) => {//Add the validate function
    req.sanitizeBody("email").normalizeEmail({
      all_lowercase: true
    }).trim();//Remove whitespace with the trim method
    req.check("email", "Email is invalid").isEmail();
    req.check("zipCode", "Zip code is invalid")
        .notEmpty().isInt().isLength({
        min: 5,
        max: 5
    }).equals(req.body.zipCode);//Validate the zipCode field.
    req.check("password", "Password cannot be empty").notEmpty();//Validate the password field.

    req.getValidationResult().then((error) => {//Collect the results of previous validations
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;//Set skip property to true.
        req.flash("error", messages.join(" and "));//Add error messages as flash messages.
        res.locals.redirect = "/users/new";//Set redirect path for the new view.
        next();
      } else {
        next();//Call the next middleware function.
      }
    });
  },

  logEmail: (req, res, next) =>{
    // this middleware should log to console the user’s email address domain (such as gmail, yahoo, or live) and pass to the next middleware function
    let email = req.body.email;
    email = email.split("@");
    console.log(email[1]);
    next();
  },

  logout: (req, res, next) => {
    req.logout();//logout its a method provided for passport clears the user’s session
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  }
};
