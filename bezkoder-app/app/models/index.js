const dbConfig = require("../config/db.config.js");

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
db.doctor = require("./tb_account_dr.model.js")(sequelize, Sequelize);
db.lab = require("./tb_account_lab.model.js")(sequelize, Sequelize);
db = require("./coupon.js")(sequelize, Sequelize, db);

module.exports = db;
