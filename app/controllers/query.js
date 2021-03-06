const db = require("../models");

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
