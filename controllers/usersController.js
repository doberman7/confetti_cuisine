const User = require("../models/user");//Require the user model

module.exports = {
  index: (req, res) => {
    User.find({})
      .then(users => {//Render the index page with an array of users
          res.render("users/index", {
            users: users
          })
      })
      .catch(error => {//Log error messages and redirect to the home page
          console.log(`Error fetching users: ${error.message}`)
        res.redirect("/");
      });
  }
};
