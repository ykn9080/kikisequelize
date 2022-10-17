module.exports = {
  HOST: "kikib-korea.mysql.database.azure.com",
  USER: "kikii@kikib-korea",
  PASSWORD: "1733a-sql",
  DB: "dev-kikib",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
