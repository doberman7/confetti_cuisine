const Subscriber = require("../models/subscriber");
  mongoose = require("mongoose");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find( {}, (error, subscribers) => {
    if (error) next(error);
    req.data = subscribers;
    next();
  });
};

// app.get("/contact", subscribersController.getSubscriptionPage);
// app.post("/subscribe", subscribersController.saveSubscriber);
