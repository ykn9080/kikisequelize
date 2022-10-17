const db = require("../../models");
const express = require("express");

const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const _ = require("lodash");

const toCamel = (data) => {
  return _.mapKeys(data, (value, key) => _.camelCase(key));
};

module.exports = (Notice) => {
  // Create and Save a new Notice
  const create = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // Create a Notice
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    };

    // Save Notice in the database
    Notice.create(tutorial)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Notice.",
        });
      });
  };

  // Retrieve all Tutorials from the database.
  const findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const intime = new Date();

    if (req.id === undefined) req.id = null;
    var query = "CALL noticelist(:userid)";

    let replacement = {
      userid: req.id,
      //userid:2871
    };

    db.sequelize
      .query(query, {
        replacements: replacement,
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then((resp) => {
        let rtn = resp[0];
        if (!rtn) {
          const val = {
            response: "no data",
            result: false,
          };

          return res.status(400).send(val);
        }
        let array = Object.values(rtn).map((k, i) => {
          return toCamel(k);
        });

        const val = {
          data: array,
        };

        return res.status(200).send(val);
      })
      .catch((err) => {
        console.log("err", err.message);
        const val = {
          response: err.message,
        };
        return res.status(400).json(val);
      });

    // Notice.findAll({ where: condition })
    //   .then((data) => {
    //     res.send(data);
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while retrieving tutorials.",
    //     });
    //   });
  };

  // Find a single Notice with an id
  const findOne = (req, res) => {
    const id = req.params.id;

    Notice.findByPk(id)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Notice with id=" + id,
        });
      });
  };

  // Update a Notice by the id in the request
  const update = (req, res) => {
    const id = req.params.id;

    Notice.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Notice was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Notice with id=${id}. Maybe Notice was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Notice with id=" + id,
        });
      });
  };

  // Delete a Notice with the specified id in the request
  const remove = (req, res) => {
    const id = req.params.id;

    Notice.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Notice was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete Notice with id=${id}. Maybe Notice was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Notice with id=" + id,
        });
      });
  };

  // // Delete all Tutorials from the database.
  // const deleteAll = (req, res) => {
  //   Tutorial.destroy({
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

  let router = express.Router();

  router.post("/", create);
  router.get("/", findAll);
  router.get("/:id", findOne);
  router.put("/:id", update);
  //router.delete("/", deleteAll);
  router.delete("/:id", remove);

  return router;
};
