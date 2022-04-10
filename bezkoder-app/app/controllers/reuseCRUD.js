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
    Table.sync({ force: false, alter: true }).then(() => {
      Table.create(req.body)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial.",
          });
        });
    });
  };

  // Retrieve all Tutorials from the database.
  const readMany = (req, res) => {
    console.log(req.query);
    const id = req.query.id;
    var condition = id ? { title: { [Op.like]: `%${id}%` } } : null;
    Table.sync({ force: false, alter: true }).then(() => {
      Table.findAll({ where: condition })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials.",
          });
        });
    });
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
          message: "Error retrieving Tutorial with id=" + id,
        });
      });
  };

  // Update a Tutorial by the id in the request
  const update = (req, res) => {
    const id = req.params.id;

    Table.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Tutorial was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id,
        });
      });
  };

  // Delete a Tutorial with the specified id in the request
  const remove = (req, res) => {
    const id = req.params.id;

    Table.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Tutorial was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id,
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
