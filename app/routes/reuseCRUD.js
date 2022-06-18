/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const crud = require("../controllers/reuseCRUD");
module.exports = (app) => {
  const db = require("../models");
  //const tb_account_dr = require("../models/tb_account_dr.model");

  //for project router
  app.use("/api/tutorial", crud(db.tutorial));
  app.use("/api/tb_doctor", crud(db.tb_doctor));
  app.use("/api/tb_account_dr", crud(db.tb_account_dr));
  app.use("/api/tb_lab", crud(db.tb_lab));
  app.use("/api/tb_account_lab", crud(db.tb_account_lab));
  app.use("/api/service", crud(db.service));
  app.use("/api/servicehistory", crud(db.servicehistory));
  app.use("/api/serviceinfo", crud(db.serviceinfo));
  app.use("/api/serviceworker", crud(db.serviceworker));
  app.use("/api/alarm", crud(db.alarm));
  app.use("/api/revisionrequest", crud(db.revisionrequest));
  app.use("/api/comment", crud(db.comment));
  app.use("/api/serviceworker", crud(db.serviceworker));
  app.use("/api/submitchange", crud(db.submitchange));
  app.use("/api/onecheck", crud(db.onecheck));
  app.use("/api/dashboard", crud(db.dashboard));
  app.use("/api/dashdata", crud(db.dashdata));

  ///app.use("/api/type", crud(db.tb_type));
  app.use("/api/couponhistoryuse", crud(db.couponhistoryuse));
  app.use("/api/couponhistorybuy", crud(db.couponhistorybuy));
  app.use("/api/coupontype", crud(db.coupontype));
  app.use("/api/couponfree", crud(db.couponfree));
  app.use("/api/couponhistoryuse", crud(db.couponhistoryuse));
};
