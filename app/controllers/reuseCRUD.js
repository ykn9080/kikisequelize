const db = require("../models");
const _ = require("lodash");
const express = require("express");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const convert  = require("../middleware/CamelSnake");

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
      const bd=convert.toSnake(req.body);
    
    Table.create(bd)
    
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
  const makeCondition = (condition) => {
    const makeOp = (opp) => {
      let op;
      switch (opp) {
        case ">=":
          op = Op.gte;
          break;
        case ">":
          op = Op.gt;
          break;
        case "<=":
          op = Op.lte;
          break;
        case "<":
          op = Op.lt;
          break;
        case "like":
          op = Op.like;
          break;
        case "in":
          op = Op.in;
          break;
        case "not in":
          op = Op.notIn;
          break;
        case "between":
          op = Op.between;
          break;
        case "not between":
          op = Op.notBetween;
          break;
        case "is null":
          op = Op.isNull;
          break;
        case "is not null":
          op = Op.isNotNull;
          break;
        default:
          null;
      }
      return op;
    };
    //--------------query example----------------
    // created_date=2020-01-01,2020-01-01$between
    // created_date=2020-01-01$>=
    // service_id=36$like
    // service_id=365,374$in
    //--------------------------------------------
    const likeattach = (op, txt) => {
      if (op === Op.like) {
        return "%" + txt + "%";
      }
      return txt;
    };
    return Object.keys(condition).map((k, i) => {
      let val1 = Object.values(condition)[i];
      const vals = val1.split("$");
      if (vals.length === 1) {
        return { [k]: vals };
      }
      const op = makeOp(vals[1]);

      const valarr = vals[0].split(",");
      valarr.map((s, j) => {
        valarr.splice(j, 1, likeattach(op, dateParse(s)));
      });

      return { [k]: { [op]: valarr } };
    });
  };
  const dateParse = (date) => {
    try {
      let datt = new Date(date);
      if ((datt.toString() === "Invalid Date") | !NaN(date)) {
        return date;
      }
      return datt;
    } catch {
      return date;
    }
  };
  const queryClean = (query) => {
    if (query) {
      Object.keys(query).map((k, i) => {
        if (typeof query[k] === "object") query[k] = Object.values(query)[i][0];
      });
      return query;
    } else return query;
  };
  // Retrieve all Tutorials from the database.
  const readMany = (req, res) => {
    req.query = queryClean(req.query);
    console.log(req.query);
    const order = req.query.order;
    const attributes = req.query.attributes;
    delete req.query.order;
    delete req.query.attributes;
    const cnt = Object.keys(req.query).length;
    // var condition = id ? { title: { [Op.like]: `%${id}%` } } : null;

    var condition = cnt > 0 ? req.query : null;
    if (condition) condition = makeCondition(condition);
    console.log("condition", condition);
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
    option.raw=true;
    //Table.sync({ force: false, alter: true }).then(() => {
    Table.findAll(option)
      .then((data) => {
        let array=Object.values(data).map((k,i)=>{
          return convert.toCamel(k);
        })

        return res.status(200).send(array);
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
    let id = req.params.id;
    let name = req.query.name;

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
    console.log(condition, req.body)
    const bd=convert.toSnake(req.body);
    Table.update(bd, {
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
        console.log(err.message);
        res.status(500).send({
          message: err.message,
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
