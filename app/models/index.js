let dbConfig = require("../config/db.config1.js");

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
const initModel = require("../../auto-models/init-models");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: 0,
  logging: false,
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
const model = initModel(sequelize);

Object.keys(model).map((k, i) => {
  return (db[k] = model[k]);
});

module.exports = db;
