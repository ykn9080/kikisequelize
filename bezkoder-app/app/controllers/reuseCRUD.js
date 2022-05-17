const db = require("../models");
const express = require("express");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
module.exports = (Table) => {
  const create = (req, res) => {
    // // Validate request
    // if (!req.body.title) {
    //   res.status(400).send({
    //     message: "Content can not be empty!",
    //   });
    //   return;
    // }

    // // Create a Tutorial
    // const tutorial = {
    //   title: req.body.title,
    //   description: req.body.description,
    //   published: req.body.published ? req.body.published : false,
    // };

    // Save Tutorial in the database
    // Table.sync({ force: false, alter: true }).then(() => {
    Table.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating.",
        });
      });
    //});
  };

  // Retrieve all Tutorials from the database.
  const readMany = (req, res) => {
    const order = req.query.order;
    const attributes = req.query.attributes;
    delete req.query.order;
    delete req.query.attributes;
    const cnt = Object.keys(req.query).length;
    // var condition = id ? { title: { [Op.like]: `%${id}%` } } : null;

    var condition = cnt > 0 ? req.query : null;
    let option = { where: condition };
    if (order) {
      var odr = order.split("^");
      odr.map((k, i) => {
        let kk = k.split("-");
        if (!kk[1]) kk[1] = "asc";
        odr.splice(i, 1, kk);
      });
      option.order = odr;
    }
    if (attributes) option.attributes = attributes.split("^");
    console.log("herer", option);
    //Table.sync({ force: false, alter: true }).then(() => {
    Table.findAll(option)
      .then((data) => {
        console.log("data", data);
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    // });
  };

  // Find a single Tutorial with an id
  const readOne = (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    let name = req.query.name;

    console.log("id:", id, "name", name, req.path);

    Table.findByPk(id)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving with id=" + id,
        });
      });
  };

  // Update a Tutorial by the id in the request
  const update = (req, res) => {
    let condition = req.params;
    if (Object.keys(req.query).length > 0) condition = req.query;
    console.log(condition);
    Table.update(req.body, {
      where: condition,
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Maybe it was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating ",
        });
      });
  };

  // Delete a Tutorial with the specified id in the request
  const remove = (req, res) => {
    const id = req.params.id;
    let condition = req.params;
    if (Object.keys(req.query).length > 0) condition = req.query;

    Table.destroy({
      where: condition,
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete with  Maybe Tutorial was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete ",
        });
      });
  };

  // // Delete all Tutorials from the database.
  // const deleteAll = (req, res) => {
  //   Table.destroy({
  //     where: {},
  //     truncate: false,
  //   })
  //     .then((nums) => {
  //       res.send({ message: `${nums} Tutorials were deleted successfully!` });
  //     })
  //     .catch((err) => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while removing all tutorials.",
  //       });
  //     });
  // };

  // // find all published Tutorial
  // exports.findAllPublished = (req, res) => {
  //   Tutorial.findAll({ where: { published: true } })
  //     .then(data => {
  //       res.send(data);
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while retrieving tutorials."
  //       });
  //     });
  // };

  // ======
  // Routes
  // ======

  let router = express.Router();

  router.post("/", create);
  router.get("/", readMany);
  router.get("/:id", readOne);
  router.put("/:id", update);
  router.delete("/:id", remove);

  return router;
};
