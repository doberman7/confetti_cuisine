const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {//Require the name property.
    type: String,
    required: true
  },
  email: {//Require the email property, and add the lowercase property
    type: String,
    required: true,
    lowercase: true,
    unique: true//The unique option isn’t a validator, but rather a Mongoose schema helper
  },
  zipCode: {//Set up the zipCode property with a custom error message
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999
  },
  courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}]//Associate multiple courses
},
  {
    timestamps: true//Add a timestamps property to record createdAt and updatedAt dates
  }
);


subscriberSchema.methods.getInfo = function() {//Add an instance method to get the full name of a subscriber
  return `Name: ${this.name} Email: ${this.email} Zip Code:
  ${this.zipCode}`;
};

// subscriberSchema.methods.findLocalSubscribers = function() {
//   return this.model("Subscriber")
//     .find({zipCode: this.zipCode})
//     .exec();//Access the Subscriber model to use the find method.
// };

module.exports = mongoose.model("Subscriber", subscriberSchema);//Export the model
