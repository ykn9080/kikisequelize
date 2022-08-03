const db = require("../../models");
const express = require("express");

const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const _ = require("lodash");
const { Route53RecoveryCluster } = require("aws-sdk");

const toCamel=(data) =>{return _.mapKeys(data, (value, key) => _.camelCase(key));}

module.exports = (Alert) => {
//custom query
const useralert = (req, res) => {
var query =
"select a.*,name,user_id,role,isread,iskeep,read_at  from alert a join user_alert b on a.id=b.alert_id join user c on b.user_id=c.id" +
" WHERE user_id=:userid";
console.log("req.id12:",req.id)
db.sequelize
.query(query, {
  replacements: {
    userid: req.id,
  },
  type: db.sequelize.QueryTypes.SELECT,
})
.then((resp) => {
  return res.status(200).send(resp);
})
.catch((err) => {
  return res.json(err.message);
});
}

  // Create and Save a new Alert

// const create = (req, res) => {
//   // Validate request
//   if (!req.body.title) {
//     res.status(400).send({
//       message: "Content can not be empty!",
//     });
//     return;
//   }

//   // Create a Alert
//   const tutorial = {
//     title: req.body.title,
//     description: req.body.description,
//     published: req.body.published ? req.body.published : false,
//   };

//   // Save Alert in the database
//   Alert.create(tutorial)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Alert.",
//       });
//     });
// };

// Retrieve all Tutorials from the database.
const findAll = (req, res) => {

  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const intime = new Date();


  var query =
    "CALL noticelist(:userid)";

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

      let rtn 
      = resp[0];
      if (!rtn) {
      
        const val = {
          response: "no data",
          result: false,
        };

        return res.status(400).send(val);
      }
      let array=Object.values(rtn).map((k,i)=>{
        return toCamel(k);
      })

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





  // Alert.findAll({ where: condition })
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

// Find a single Alert with an id
const findOne = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Alert with id=" + id,
      });
    });
};

// Update a Alert by the id in the request
const update = (req, res) => {
  const id = req.params.id;

  Alert.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alert was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Alert with id=${id}. Maybe Alert was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Alert with id=" + id,
      });
    });
};

// Delete a Alert with the specified id in the request
const remove = (req, res) => {
  const id = req.params.id;

  Alert.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alert was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Alert with id=${id}. Maybe Alert was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Alert with id=" + id,
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

//router.post("/", create);
router.get("/",useralert)
//router.get("/", findAll);
// router.get("/:id", findOne);
// router.put("/:id", update);
//router.delete("/", deleteAll);
//router.delete("/:id", remove);

return router;
}