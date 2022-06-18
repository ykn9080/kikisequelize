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

  app.use("/api/dashboard", crud(db.dashboard));
  app.use("/api/dashdata", crud(db.dashdata));
};
