onst mongoose = require("mongoose"),
  {Schema} = mongoose,

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
