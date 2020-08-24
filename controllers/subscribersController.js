const Subscriber = require("../models/subscriber");
  mongoose = require("mongoose");

exports.getAllSubscribers = (req, res) => {//Retrieve all subscribers
  Subscriber.find({})
    .exec()//Return a promise from the find query

    .then((subscribers) => {//Send saved data to the next then code block.
      res.render("subscribers", {
        subscribers: subscribers
      });//Serve results from the database
    })
    .catch((error) => { //Catch errors that are rejected in the promise
      console.log(error.message);
      return [];
    })
    .then(() => {//End the promise chain with a log message
      console.log("promise complete");
    });
};

exports.getSubscriptionPage = (req, res) => {//Add an action to render the contact page
  res.render("contact");
};

exports.saveSubscriber = (req, res) => {// Add an action to save subscribers
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });//Create a new subscriber

  newSubscriber.save()
    .then(result => {//Save a new subscriber with a promise return
      res.render("thanks");
    })
    .catch(error => {
      if (error) res.send(error);
    })
};
//we supose to wirte this but not sure how
// module.exports = {
//   showSubscriber: (req, res) => {
//     res.render("courses", {
//       offeredCourses: courses
//     });
//   }
// };
