/*
재사용가능 mongoose CRUD 기능과 model처리
재사용가능한 CRUD는 ./controller/reuseCRUD.js
모든 모델을 한곳에서 처리함 ./model/models.js
*/

const crud = require("../controllers/reuseCRUD");

module.exports = (app) => {
  const models = require("../models");
  //for project router
  const removes=["tutorial"]
  Object.keys(models).map((k,i)=>{
    if(removes.indexOf(k)===-1)
    app.use(`/api/${k}`, crud(models[k]))
  })


  
 
};
