exports.respondWithName = (req,res) => {
  let paramsName = req.params.myName;//assign a local var to a req parameter
  res.render("index", {name: paramsName});//pass local var to a rendered view
};
