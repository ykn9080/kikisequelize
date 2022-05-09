const proc = require("../controllers/procedure");
const query = require("../controllers/query");
const s3 = require("../util/s3");

module.exports = (app) => {
  //   const db = require("../models");
  //   //const tb_account_dr = require("../models/tb_account_dr.model");
  //   //for project router
  //   app.use("/sp/patient", crud(db.tutorial));
  //   app.use("/api/doctor", crud(db.tb_account_dr));
  //   app.use("/api/type", crud(db.tb_type));
  app.use("/api/couponuse", proc.couponuse);
  app.use("/api/couponcount", proc.couponcount);
  app.use("/api/couponbuy", proc.couponbuy);
  app.use("/api/findlast", proc.findLast);
  app.use("/api/getPatientInfo", query.getPatientInfo);
  app.use("/api/getQuery", query.getQuery);

  app.use("/s3", s3.s3Object);
};
