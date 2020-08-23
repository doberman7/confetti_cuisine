const mongoose = require("mongoose"),
  {Schema} = mongoose,//Notice the use of object destructuring for the Mongoose Schema object. {Schema} assigns the Schema object in mongoose to a constant by the same name.

  userSchema = new Schema({//Create the user schema
  name: {//Add first and last name properties
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [1000, "Zip code too short"],
    max: 99999
  },
  password: {
    type: String,
    required: true
  },//Add a password property.
  courses: [{type: Schema.Types.ObjectId, ref: "Course"}],//Add a courses property to connect users to courses.
  subscribedAccount: {type: Schema.Types.ObjectId, ref:
 "Subscriber"}//Add a subscribedAccount to connect users to subscribers
}, {
  timestamps: true//Add a timestamps property to record createdAt and updatedAt dates
});

userSchema.virtual("fullName")
  .get(function() {
    return `${this.name.first} ${this.name.last}`;
  });//Add a virtual attribute to get the user’s full name

module.exports = mongoose.model("User", userSchema);
