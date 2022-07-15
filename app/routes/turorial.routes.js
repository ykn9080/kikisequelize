const auth = require("../middleware/auth");
module.exports = app => {
  const tutorials = require("../controllers/custom/notice.js");

  var router = require("express").Router();
  
  // Create a new Tutorial
  router.post("/api/tutorial", auth, tutorials.create);

  // Retrieve all Tutorials
  router.get("/api/tutorial", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/api/tutorial/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/api/tutorial/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/api/tutorial/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/api/tutorial/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("api/tutorial", tutorials.deleteAll);

  //app.use('/api/tutorials', router);
};
