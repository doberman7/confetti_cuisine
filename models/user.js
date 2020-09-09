const Subscriber = require("./subscriber"),
  mongoose = require("mongoose"),
  {Schema} = mongoose,//Notice the use of object destructuring for the Mongoose Schema object. {Schema} assigns the Schema object in mongoose to a constant by the same name.
  bcrypt = require("bcrypt"),
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
  courses: [
    {
      type: Schema.Types.ObjectId, ref: "Course"
    }
  ],//Add a courses property to connect users to courses.
  subscribedAccount: {
    type: Schema.Types.ObjectId, ref:
    "Subscriber"
  }//Associate users with subscribers.
},
{
  timestamps: true//Add a timestamps property to record createdAt and updatedAt dates
});

userSchema.virtual("fullName")
  .get(function() {
    return `${this.name.first} ${this.name.last}`;
  });//Add a virtual attribute to get the user’s full name


userSchema.pre("save", function (next) {//Set up the pre(‘save’) hook
  let user = this;//Use the function keyword in the callback
  if (user.subscribedAccount === undefined) {//Add a quick conditional check for existing subscriber connections
    Subscriber.findOne({
      email: user.email
    })//Query for a single subscriber
      .then(subscriber => {
        user.subscribedAccount = subscriber;//Connect the user with a subscriber account
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:
 ${error.message}`);
         next(error);//Pass any errors to the next middleware function.
      });
    } else {
      next();//Call next function if user already has an association
    }
});
//Hash User
userSchema.pre("save", function(next) {//Add a pre hook to the user schema.
  let user = this;

  bcrypt.hash(user.password, 10).then(hash => {//Hash the user’s password
    user.password = hash;
    next();
  })
    .catch(error => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});




// Hash Email
userSchema.pre("save", function(next) {
  let user = this;

  bcrypt.hash(user.email, 10).then(hash => {
    user.email = hash;
    next();
  })
    .catch(error => {
      console.log(`Error in hashing email: ${error.message}`);
      next(error);
    });
});


userSchema.methods.emailComparison = function(inputEmail){//Add a function to compare hashed emails.
  let user = this;
  return bcrypt.compare(inputEmail, user.email);//Compare the user email with the stored email
};



userSchema.methods.passwordComparison = function(inputPassword){//Add a function to compare hashed passwords.
  let user = this;
  return bcrypt.compare(inputPassword, user.password);//Compare the user password with the stored password
};


module.exports = mongoose.model("User", userSchema);
