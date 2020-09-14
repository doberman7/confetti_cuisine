const Subscriber = require("../models/subscriber"),
  chalkAnimation = require('chalk-animation'),
  getSubscriberParams = (body) => {
    return {
      name: body.name,
      email: body.email,
      zipCode: parseInt(body.zipCode)
    };
  },
  mongoose = require("mongoose");

module.exports = {

    index: (req, res, next) => {
      Subscriber.find() //Run query in index action only.
        .then(subscribers => {
          res.locals.subscribers = subscribers;//Store the subscriber data on the response and call the next middleware function
            next();
        })
        .catch(error => {
          console.log(`Error fetching subscribers: ${error.message}`);
          next(error);//Catch errors, and pass to the next middleware.
        });
    },

    indexView: (req, res) => {
      res.render("subscribers/index",{
        flashMessages: {
          success: "Loaded all subscribers!"
        }
      });//Render view in separate action.
    },

    new: (req, res) => {//Add the new action to render a form  NOT WORKING
      res.render("subscribers/new");
    },

    create: (req, res, next) => {//Add the create action to save the subscriber to the database.
      let subscriberParams = getSubscriberParams(req.body);
      Subscriber.create(subscriberParams)//Create subscribers with form parameters
        .then(subscriber => {
          req.flash("success", `${subscriber.name}'s account created successfully!`);//Respond with a success flash message.
          res.locals.redirect = "/subscribers";
          res.locals.subscriber = subscriber;
          next();
        })
        .catch(error => {
          console.log(`Error saving subscriber: ${error.message}`);
          res.locals.redirect = "/subscribers/new";
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
      let subscriberId = req.params.id;//Collect the subscriber ID from the request params
      let isAnID = mongoose.Types.ObjectId.isValid(subscriberId);//THIS FIX in case no valid ID
      if (isAnID){
        Subscriber.findById(subscriberId)//Find a subscriber by its ID.
            .then(subscriber => {
              res.locals.subscriber = subscriber;//Pass the subscriber through the response object to the next middleware function.
                next();
            })
            .catch(error => {
              console.log(`Error fetching subscriber by ID: ${error.message}`);
              next(error);//
            });
      } else if (subscriberId == "new"){
        console.log("route new NOT WORKING, harcore approach")
        res.render("subscribers/new");
        }
    },

    showView: (req, res) => {
      res.render("subscribers/show");//Render show view
    },

    edit: (req, res, next) => {//Add the edit action.
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)//Use findById to locate a subscriber in the database by their ID
        .then(subscriber => {
          res.render("subscribers/edit", {
            subscriber: subscriber//?
          });//Render the subscriber edit page for a specific subscriber in the database
        })
        .catch(error => {
          console.log(`Error fetching subscriber by ID: ${error.message}`);
          next(error);
        });
    },

    update: (req, res, next) => {//Add the update action.
      mongoose.set('useFindAndModify', false);//this turn off depraction warning
      let subscriberParams = getSubscriberParams(req.body);//Collect subscriber parameters from reques

      Subscriber.findByIdAndUpdate(subscriberId, {
        $set: subscriberParams
      })//Use findByIdAndUpdate to locate a subscriber by ID and update the document record in one command.
          .then(subscriber => {
            res.locals.redirect = `/subscribers/${subscriberId}`;
            res.locals.subscriber = subscriber;
            next();//Add subscriber to response as a local variable, and call the next middleware function
          })
          .catch(error => {
            console.log(`Error updating subscriber by ID: ${error.message}`);
            next(error);
          });
    },

    delete: (req, res, next) => {
    let subscriberId = req.params.id;
    mongoose.set('useFindAndModify', false);//this turn off depraction warning
    Subscriber.findByIdAndRemove(subscriberId)
        .then(() => {
          res.locals.redirect = "/subscribers";
          next();
        })
        .catch(error => {
          console.log(`Error deleting subscriber by ID: ${error.message}`);
          next();
        });
    }

  // getSubscriptionPage: (req, res) => {//Add an action to render the contact page
  //   res.render("contact");
  // },
  //
  // saveSubscriber: (req, res) => {// Add an action to save subscribers
  //   let newSubscriber = new Subscriber({
  //     name: req.body.name,
  //     email: req.body.email,
  //     zipCode: req.body.zipCode
  //   });//Create a new subscriber
  //
  //   newSubscriber.save()
  //     .then(result => {//Save a new subscriber with a promise return
  //       res.render("thanks");
  //     })
  //     .catch(error => {
  //       if (error) res.send(error);
  //     })
  // }

}
