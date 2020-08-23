const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");


mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true,
    useUnifiedTopology: true,
    CreateIndexes: true
  }
);
User.create( {
  name: ["Tom","johns"],
  email: "orders@manning.com",
  zipCode: "12345",
  password: "password"
}).then(user => testUser = user) .catch(error=>console.log(error.message));





var testUser;
User.create({
  name: {
    first: "jon",
    last: "Wexler"
  },
  email: "jon@jonwexler.com",
  password: "pass123"
}).then(user => testUser = user).catch(error => console.log(error.message));

// var testCourse,
// testSubscriber;

mongoose.Promise = global.Promise;


var targetSubscriber;
Subscriber.findOne({email: testUser.email }).then(subscriber => targetSubscriber = subscriber);




var testUser;
User.create({
  name: {
    first: "Jon",
    last: "Wexler "
  },
  email: "jon@jonwexler.com",
  password: "pass123"
}).then(user => {
    testUser = user;
    return Subscriber.findOne({
      email: user.email
    });
  }).then(subscriber => {
    testUser.subscribedAccount = subscriber;
      testUser.save().then(user => console.log("user updated"));
  }).catch(error => console.log(error.message));
