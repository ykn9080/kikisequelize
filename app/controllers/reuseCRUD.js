const db = require("../models");
const _ = require("lodash");
const express = require("express");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const convert = require("../middleware/CamelSnake");
const proc = require("./procedure");

// Create and Save a new Tutorial
module.exports = (Table) => {
  const create = (req, res) => {
    if (req.body.data && req.body.data.length > 0) {
      /** bulk insert일 경우, data에 key를 제외한 필드전송
       * data= [
          { stop_type: "ttt1" },
          { stop_type: "ttt1" },
        ]
       */

      const data = convert.toSnakeObjArray(req.body.data);

      Table.bulkCreate(data)
        .then(function (response) {
          let array = Object.values(response).map((k, i) => {
            return convert.toCamel(k);
          });

          res.send({
            status: 200,
            message: "success",
            object: array,
          });
        })
        .catch(function (error) {
          res.send(error);
        });
    } else {
      const bd = convert.toSnake(req.body);
      Table.create(bd)
        .then((data) => {
          let newdata = convert.toCamel(data.get({ plain: true }));
          afterCreateEvent(Table, newdata, res);
          res.send({
            status: 200,
            message: "save success",
            object: data,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating.",
          });
        });
    }
  };
  const makeCondition = (condition) => {
    const makeOp = (opp) => {
      let op;
      switch (opp) {
        case ">=":
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
    // others($후의 조건): >,<=,<, not in, not between,is null, is not null
    // order=name^date(name, date orderby)
    // order=name-desc^date-asc(name은 desc, date는 asc orderby)
    // attribute=id^name (id와 name만)
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

    req.query = convert.toSnake(req.query);

    const order = req.query.order;
    const attributes = req.query.attributes;
    delete req.query.order;
    delete req.query.attributes;
    const cnt = Object.keys(req.query).length;
    // var condition = id ? { title: { [Op.like]: `%${id}%` } } : null;

    var condition = cnt > 0 ? req.query : null;
    if (condition) condition = makeCondition(condition);
    let option = { where: condition };
    if (order) {
      var odr = order.split("^");
      odr.map((k, i) => {
        let kk = k.split("-");
        kk[0] = convert.toSnakeSingle(kk[0]);
        if (!kk[1]) kk[1] = "asc";
        odr.splice(i, 1, kk);
      });
      option.order = odr;
    }
    if (attributes) option.attributes = attributes.split("^");
    option.raw = true;
    //Table.sync({ force: false, alter: true }).then(() => {
    Table.findAll(option)
      .then((data) => {
        let array = Object.values(data).map((k, i) => {
          return convert.toCamel(k);
        });

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

    if (condition.id === "bulk") {
      /** bulk update일 경우, data에 key와 바꿀 필드와 값을 넘김
       * data= [
          { id: 30, stop_type: "ttt1" },
          { id: 31, stop_type: "ttt1" },
        ],
        onduplicate= ["stop_type"]
       */
      const data = convert.toSnakeObjArray(req.body.data);
      const onduplicate = convert.toSnakeArray(req.body.duplicate);
      Table.bulkCreate(data, {
        updateOnDuplicate: onduplicate,
      })
        .then(function (response) {
          res.send({
            status: 200,
            message: "success",
            object: response,
          });
        })
        .catch(function (error) {
          res.send(error);
        });
    } else {
      const bd = convert.toSnake(req.body);
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
    }
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
            message: `Cannot delete Maybe data was not found!`,
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

  const afterCreateEvent = (Table, data, res) => {
    if (Table === db["stopworking"]) {
      const replacement = {
        driverId: data.driverId,
        referId: data.id,
      };
      proc.commonQueryBody(
        "alert_create(:driverId,null,'stop_working', :referId)",
        replacement
      );
    }
  };
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
