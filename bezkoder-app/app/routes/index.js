const proc = require("../controllers/procedure");

module.exports = (app) => {
  //   const db = require("../models");
  //   //const tb_account_dr = require("../models/tb_account_dr.model");
  //   //for project router
  //   app.use("/sp/patient", crud(db.tutorial));
  //   app.use("/api/doctor", crud(db.tb_account_dr));
  //   app.use("/api/type", crud(db.tb_type));
  app.use("/api/couponuse", proc.couponuse);
  app.use("/api/couponout", proc.couponout);
};
