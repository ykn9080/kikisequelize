const db = require("../models");
//const crypto = require("../util/crypto");

var crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.key; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
function encrypt(text) {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(text) {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

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
exports.cryptotest = (req, res) => {
  console.log(req.body);
  const rtn = crypto.decrypt(req.body.encrypt);
  console.log(rtn);
  return res.status(400).send(rtn);
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

  var query =
    "CALL couponuse(:account_id, :islab, :service_id ,:number_of_deductions)";
  let decr = JSON.parse(crypto.decrypt(req.body.encrypt, "DIORCO20141111"));

  console.log("decr", decr);

  db.sequelize
    .query(query, {
      replacements: {
        account_id: decr.account_id,
        islab: decr.islab == "true" ? 1 : 0,
        service_id: decr.service_id,
        number_of_deductions: decr.number_of_deductions,
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.random();

      return res.status(200).send(rtn);
      //return res.status(200).send(resp[0]["0"]);
      //console.log("this is resp", crypto.encrypt(resp));
      //return res.send({ tickcount: "abc" });
    })
    .catch((err) => {
      console.log("err", err.message);
      return res.json(err.message);
    });
};
exports.couponcount = (req, res) => {
  console.log("body", req.body);
  let decr = JSON.parse(decrypt(req.body.encrypt));

  console.log("decr", decr);

  var query = "CALL couponcount(:account_id, :islab)";
  db.sequelize
    .query(query, {
      replacements: {
        account_id: parseInt(decr.account_id),
        islab: parseInt(decr.islab),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.random();
      console.log(rtn);
      return res.status(200).send(rtn);
      //console.log("this is resp", crypto.encrypt(resp));
      //return res.send({ tickcount: "abc" });
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
