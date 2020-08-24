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
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.create(userParams)
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
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  }
};
