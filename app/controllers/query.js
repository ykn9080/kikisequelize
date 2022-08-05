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
