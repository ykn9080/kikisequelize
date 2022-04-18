const db = require("../models");
const crypto = require("../util/crypto");

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

exports.couponuse = (req, res) => {
  console.log(req.body);
  var query =
    "CALL couponuse(:account_id, :islab, :service_id ,:number_of_deductions)";
  let decr = JSON.parse(crypto.decrypt(req.body.request));

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
      if (!rtn.msg) {
        const val = { result: false, reason: rtn.errmsg };
        return res.status(400).send({
          request: crypto.encrypt(JSON.stringify(val)),
        });
      }
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.floor(Math.random() * 10000000000);
      const val = { response: rtn, result: true };
      console.log(rtn);
      return res.status(200).send({
        request: crypto.encrypt(JSON.stringify(val)),
      });
    })
    .catch((err) => {
      console.log("err", err.message);
      const val = { result: false, reason: err.message };
      return res.json({
        request: crypto.encrypt(JSON.stringify(val)),
      });
    });
};
exports.couponcount = (req, res) => {
  console.log("body", req.body);
  let decr = JSON.parse(crypto.decrypt(req.body.request));

  console.log("decr", decr);

  var query = "CALL couponcount(:account_id, :islab)";
  db.sequelize
    .query(query, {
      replacements: {
        account_id: parseInt(decr.account_id),
        islab: decr.islab == "true" ? 1 : 0,
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      console.log(rtn);

      if (!rtn.number_of_coupons) {
        const val = { result: false, reason: rtn.errmsg };
        console.log(val);
        return res.status(400).send({
          request: crypto.encrypt(JSON.stringify(val)),
        });
      }
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.floor(Math.random() * 10000000000);
      const val = { response: rtn, reason: "", result: true };

      return res.status(200).send({
        request: crypto.encrypt(JSON.stringify(val)),
      });
    })
    .catch((err) => {
      return res.json({
        request: crypto.encrypt(JSON.stringify(val)),
      });
    });
};
