const db = require("../models");

exports.querytest = (req, res) => {
  db.sequelize
    .query("SELECT * FROM tb_type", {
      model: db.tb_type,
      mapToModel: true, // pass true here if you have any mapped fields
    })
    .then((rtn) => {
      return res.status(400).send(rtn);
    });
};

exports.couponout = async (req, res) => {
  const results = await db.sequelize.query(
    "EXEC couponuse :doctorid, :amount, :isuse;",
    {
      replacements: {
        doctorid: req.body.doctorid,
        amount: req.body.amount,
        isuse: req.body.isuse,
      },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );
};
exports.proctest = (req, res) => {
  var query = "CALL SP_PATIENT_R(:id)";

  db.sequelize
    .query(query, {
      replacements: { id: req.query.id },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      return res.status(200).send(resp);
    })
    .catch((err) => {
      return res.json(err.message);
    });
};
exports.couponuse = (req, res) => {
  // db.sequelize
  //   .query("CALL coupon (:Firstname, :Lastname)", {
  //     replacements: { Firstname: "fistname", Lastname: "lastname" },
  //   })
  //   .then((v) => console.log(v));
  console.log(req.body);
  var query = "CALL couponuse(:doctorid, :amount, :isuse)";
  db.sequelize
    .query(query, {
      replacements: {
        doctorid: req.body.doctorid,
        amount: req.body.amount,
        isuse: req.body.isuse,
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
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.title) {
//     res.status(400).send({
//       message: "Content can not be empty!",
//     });
//     return;
//   }

// sequelize
//   .query("CALL SP_PATIENT_R(" + queryData + ");", {
//     type: sequelize.QueryTypes.SELECT,
//   })
//   .then((entity) => {
//     var Unit = Object.keys(entity[0]);
//     var UnitList = [];
//     for (var i = 0; i < Unit.length; i++) {
//       UnitList.push(entity[0][i]);
//     }
//     var Fyear = Object.keys(entity[1]);
//     var FyearList = [];
//     for (var j = 0; j < Fyear.length; j++) {
//       FyearList.push(entity[1][j]);
//     }
//     return res.status(200).json({ UnitList: UnitList, FyearList: FyearList });
//   })
//   .catch(handleError(res));
