module.exports = {
  HOST: "kikib-mysql.mysql.database.azure.com",
  USER: "kikii",
  PASSWORD:"mysql-1733",
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
