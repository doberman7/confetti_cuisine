"use strict";

const Course = require("../models/course"),
  chalkAnimation = require('chalk-animation'),
  mongoose = require("mongoose"),
  httpStatus = require("http-status-codes"),
  User = require("../models/user"),
  getCourseParams = body => {
    // chalkAnimation.radar('chalk-animation');

    return {
      title: body.title,
      description: body.description,
      maxStudents: body.maxStudents,
      cost: body.cost
    };
  };

module.exports = {

  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    // // if (req.query.format === "json") {
    // let ServerResponse = res.json(res.locals.courses);//Respond with JSON if the format query param equals json
    //    console.log(ServerResponse);
       chalkAnimation.neon(" ServerResponse course")
    //
    //   } else {
       res.render("courses/index");//Respond with an EJS view if the format query param doesn’t equal json.
    //     chalkAnimation.karaoke("error json res courses")
    //   }
  },

  new: (req, res) => {
    res.render("courses/new");
  },

  create: (req, res, next) => {
    chalkAnimation.neon('createCourse');
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then(course => {
        req.flash("success", `${course.title} Course created successfully!`);
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        res.locals.redirect = "/courses/new";
        req.flash(
          "error",
          `Failed to create user account because:  ${error.message}.`
        );
        next();
      });
  },

  show: (req, res, next) => {
    chalkAnimation.glitch("course show");
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    chalkAnimation.pulse("course showView");
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    chalkAnimation.neon("editCourse")
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    chalkAnimation.karaoke("course update")
    let courseId = req.params.id,
      courseParams = getCourseParams(req.body);
    mongoose.set('useFindAndModify', false);//this turn off depraction warning
    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    chalkAnimation.neon("delete course");
    let courseId = req.params.id;
    mongoose.set('useFindAndModify', false);
    Course.findByIdAndRemove(courseId)
      .then(() =>{
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error=>{
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  respondJSON: (req, res) => {//Handle the request from previous middleware, and submit response.
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });//Respond with the response’s local data in JSON format
  },

  errorJSON: (error, req, res, next) => {//Respond with a 500 status code and error message in JSON format.
    let errorObject;
    // chalkAnimation.neon("errorJson");

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error."
      };
    }

    res.json(errorObject);
  },

  join: (req, res, next) => {//Add the join action to let users join a course.
    let courseId = req.params.id,
      currentUser = req.user;//Get the course id and current user from the request.

    if (currentUser) {//Check whether a current user is logged in.
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId//Update the user’s courses field to contain the targeted course.
        }
      })
        .then(() => {
          res.locals.success = true;//Respond with a JSON object with a success indicator.
          next();
        })
        .catch(error => {
          next(error);//Respond with a JSON object with an error indicator.
        });
    } else {
      next(new Error("User must log in."));//Pass an error through to the next middleware function.
    }
  },

};
