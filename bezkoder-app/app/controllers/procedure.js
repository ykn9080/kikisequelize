const db = require("../models");
const crypto = require("../util/crypto");
const moment = require("moment");

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
  const intime = new Date();
  console.log(req.body);
  var query =
    "CALL couponuse(:account_id, :islab, :service_id,:number_of_deductions)";

  let decr = JSON.parse(crypto.decrypt(req.body.request));

  console.log(
    "decr",
    decr,
    !isNaN(parseInt(decr.service_id)) ? parseInt(decr.service_id) : null
  );

  db.sequelize
    .query(query, {
      replacements: {
        account_id: parseInt(decr.account_id),
        islab: (decr.islab === true) | (decr.islab === "true") ? 1 : 0,
        service_id: !isNaN(parseInt(decr.service_id))
          ? parseInt(decr.service_id)
          : null,
        number_of_deductions: parseInt(decr.number_of_deductions),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      if (!rtn.msg) {
        let encrytedrtn = crypto.encrypt(
          JSON.stringify({
            number_of_coupons: rtn.number_of_coupons,
            magic_code: decr.magic_code,
            salt: Math.floor(Math.random() * 10000000000),
          })
        );
        const val = {
          response: encrytedrtn,
          result: false,
          reason: rtn.errmsg,
          result_code: rtn.result_code,
        };
        console.log(val);
        return res.status(400).send(val);
      }
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.floor(Math.random() * 10000000000);

      var ms = moment(new Date(), "DD/MM/YYYY HH:mm:ss.SSS").diff(
        moment(intime, "DD/MM/YYYY HH:mm:ss.SSS")
      );
      var d = moment.duration(ms);
      var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss.SSS");
      console.log(rtn);
      let encrytedrtn = crypto.encrypt(JSON.stringify(rtn));
      if (decr.plain) encrytedrtn = rtn;
      const val = {
        response: encrytedrtn,
        reason: "",
        result: true,
        result_code: 0,
        intime: intime,
        outtime: new Date(),
        length: s,
      };

      return res.status(200).send(val);
    })
    .catch((err) => {
      console.log("err", err.message);
      const val = {
        response: "",
        result: false,
        reason: err.message,
        result_code: 10,
      };
      return res.json(val);
    });
};
exports.couponcount = (req, res) => {
  console.log("body", req.body);
  const intime = new Date();
  let decr = JSON.parse(crypto.decrypt(req.body.request));

  console.log("decr", decr);

  var query = "CALL couponcount(:account_id, :islab)";
  db.sequelize
    .query(query, {
      replacements: {
        account_id: parseInt(decr.account_id),
        islab: (decr.islab === true) | (decr.islab === "true") ? 1 : 0,
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      console.log(rtn);

      if (!rtn.number_of_coupons) {
        const val = {
          response: "",
          result: false,
          reason: rtn.errmsg,
          result_code: rtn.result_code,
        };
        console.log(val);
        return res.status(400).send(val);
      }
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.floor(Math.random() * 10000000000);
      console.log(rtn);

      let encrytedrtn = crypto.encrypt(JSON.stringify(rtn));
      if (decr.plain) encrytedrtn = rtn;
      var ms = moment(new Date(), "DD/MM/YYYY HH:mm:ss.SSS").diff(
        moment(intime, "DD/MM/YYYY HH:mm:ss.SSS")
      );
      var d = moment.duration(ms);
      var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss.SSS");

      const val = {
        response: encrytedrtn,
        reason: "",
        result: true,
        result_code: 0,
        intime: intime,
        outtime: new Date(),
        length: s,
      };

      return res.status(200).send(val);
    })
    .catch((err) => {
      const val = {
        response: "",
        result: false,
        reason: err.message,
        result_code: 10,
      };
      return res.json(val);
    });
};

exports.couponbuy = (req, res) => {
  console.log("body", req.body);
  const intime = new Date();
  let decr = JSON.parse(crypto.decrypt(req.body.request));

  console.log("decr", decr);

  var query = "CALL couponbuy(:account_id, :islab, :coupontype)";
  db.sequelize
    .query(query, {
      replacements: {
        account_id: parseInt(decr.account_id),
        islab: (decr.islab === true) | (decr.islab === "true") ? 1 : 0,
        coupontype: parseInt(decr.coupontype),
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      let rtn = resp[0]["0"];
      console.log(rtn);

      if (!rtn.number_of_coupons) {
        const val = {
          response: "",
          result: false,
          reason: rtn.errmsg,
          result_code: rtn.result_code,
        };
        console.log(val);
        return res.status(400).send(val);
      }
      rtn.magic_code = decr.magic_code;
      rtn.salt = Math.floor(Math.random() * 10000000000);
      console.log(rtn);

      let encrytedrtn = crypto.encrypt(JSON.stringify(rtn));
      if (decr.plain) encrytedrtn = rtn;
      var ms = moment(new Date(), "DD/MM/YYYY HH:mm:ss.SSS").diff(
        moment(intime, "DD/MM/YYYY HH:mm:ss.SSS")
      );
      var d = moment.duration(ms);
      var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss.SSS");

      const val = {
        response: encrytedrtn,
        reason: "",
        result: true,
        result_code: 0,
        intime: intime,
        outtime: new Date(),
        length: s,
      };

      return res.status(200).send(val);
    })
    .catch((err) => {
      const val = {
        response: "",
        result: false,
        reason: err.message,
        result_code: 10,
      };
      return res.json(val);
    });
};
