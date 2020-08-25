
module.exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses
  });
};

exports.showSignUp = (req, res) => {
  res.render("contact");
};
exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};

var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];


//this breaks everithing dont knoe why...chinga tu madre libro
// module.exports = {//Export object literal with all controller actions
//   showCourses: (req, res) => {
//     res.render("courses", {
//       offeredCourses: courses
//     });
//   }
// };
