let dbConfig = require("../config/db.config1.js");

console.log(dbConfig)
//if(dbConfig.HOST==="undefined")
// dbConfig={
//   HOST: "imcmaster.iptime.org",
//   USER: "yknam",
//   PASSWORD: "ykn9080",
//   DB: "devkikib",
//   port: 3307,
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// }
const initModel=require("../../models/init-models.js")
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  define: {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
  },
});

let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorial = require("./tutorial.model.js")(sequelize, Sequelize);

//db = require("./misc.js")(sequelize, Sequelize, db);
const model=initModel(sequelize);

Object.keys(model).map((k,i)=>{
  return db[k]=model[k];
})
// // db.bus = model.bus;
// // db.business_place= model.business_place ;
// // db.company= model.company ;
// // db.day_off= model.day_off ;
// // db.delete_user= model.delete_user ;
// // db.dispatch= model.dispatch ;
// // db.driving_issue= model. ;
// // db.edge_device= model. ;
// // db.hibernate_sequence= model. ;
// // db.holidays= model. ;
// // db.lost= model. ;
// // db.manage= model. ;
// db.notice= model.notice ;
// // db.notification= model. ;
// // db.replace_request= model. ;
// // db.route= model. ;
// // db.route_driver= model. ;
// // db.route_setting= model. ;
// // db.schedule_request= model. ;
// // db.schedule_setting= model. ;
// // db.stop_working= model. ;
// db.tutorial= model.tutorial ;
// db.user= model.user ;
// // db.user_notice= model. ;
// // db.work= model. ;
// // db.work_check= model. ;
// // db.work_request= model. ;
module.exports = db;
