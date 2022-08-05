/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const crud = require("../controllers/reuseCRUD");

module.exports = (app) => {
  const models = require("../models");
  //for project router
  const removes = ["alert", "user_alert", "notice"];
  Object.keys(models).map((k, i) => {
    if (removes.indexOf(k) === -1) {
      app.use(`/api/${k}`, modifyData(k), crud(models[k]));
    }
  });
};

/**
  entitiy별로 별도의 가공이 필요한 경우 사용하는 middleware
 */
const modifyData = (modelname) => {
  return function (req, res, next) {
    switch (modelname) {
      case "stopworking":
        console.log(
          "req.query:",
          req.query,
          "req.body:",
          req.body,
          "req.path:",
          req.path
        );
        //update
        if (Object.keys(req.query).length > 0) {
          req.body.updated_at = Date.now();
        }
        //create
        else if (Object.keys(req.body).length > 0) {
          req.body.created_at = Date.now();
          req.body.updated_at = null;
        }
        break;
    }
    next();
  };
};
