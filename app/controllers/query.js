const db = require("../models");
const route_driver=db.route_driver;
const convert  = require("../middleware/CamelSnake");
/**
{
    "query":
    "SELECT a.* FROM tb_patient a LEFT JOIN tb_service b ON a.patient_id = b.patient_id WHERE b.service_id=:service_id",
    "replacements":{"service_id":3}
}
 */
exports.getQuery = (req, res) => {
  db.sequelize
    .query(req.body.query, {
      replacements: req.body.replacements,
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};
exports.getPatientInfo = (req, res) => {
  var query =
    "SELECT a.* FROM tb_patient a LEFT JOIN tb_service b ON a.patient_id = b.patient_id" +
    " WHERE b.service_id=:service_id";
  db.sequelize
    .query(query, {
      replacements: {
        service_id: parseInt(req.body.service_id),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};


exports.getPatientInfo = (req, res) => {
  var query =
    "SELECT a.* FROM tb_patient a LEFT JOIN tb_service b ON a.patient_id = b.patient_id" +
    " WHERE b.service_id=:service_id";
  db.sequelize
    .query(query, {
      replacements: {
        service_id: parseInt(req.body.service_id),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};


exports.getUserAlert = (req, res) => {
  var query =
    "SELECT a.* FROM tb_patient a LEFT JOIN tb_service b ON a.patient_id = b.patient_id" +
    " WHERE b.service_id=:service_id";
  db.sequelize
    .query(query, {
      replacements: {
        service_id: parseInt(req.body.service_id),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};
exports.getWorkbyManager = (req, res) => {
  var query ="select * from work  where route_id = :routeId and date = :date"

  db.sequelize
    .query(query, {
      replacements: {
        routeId: parseInt(req.body.routeId),
        date: req.body.date
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      if (!resp) {
        const val = {
          response: "no data",
          result: false,
        };

        return res.status(400).send(val);
      }
      let array=Object.values(resp).map((k,i)=>{
        return convert.toCamel(k);
      })

      return res.status(200).send(array);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};
exports.getUserWithStopWorking = (req, res) => {
  var query ="select * from user  where id = :userId"
console.log("req.path", req.path)
  db.sequelize
    .query(query, {
      replacements: {
        userId: parseInt(req.path.replace("/",""))
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      if (!resp) {
        const val = {
          response: "no data",
          result: false,
        };

        return res.status(400).send(val);
      }
     
      let array=Object.values(resp).map((k,i)=>{
        return convert.toCamel(k);
      })
      const rtn={
        status:200,
        message:"user list return 성공",
        object: array
      }
      f
      return res.status(200).send(rtn);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};

exports.fixedupdate = (req, res) => {
  req.dt.map((k,i)=>{
      db.route_driver.update({fixed_start_order:k.fixed_start_order,created_at:k.created_at }, {
          where: { id: k.id },
        });
  });
 res.send(req.dt);
      // .then((num) => {
      //   if (num == 1) {
      //     res.send({
      //       message: "Tutorial was updated successfully.",
      //     });
      //   } else {
      //     res.send({
      //       message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
      //     });
      //   }
      // })
      // .catch((err) => {
      //   res.status(500).send({
      //     message: "Error updating Tutorial with id=" + id,
      //   });
      // });
}
