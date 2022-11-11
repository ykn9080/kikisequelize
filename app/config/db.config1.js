module.exports = {
  HOST: "kikib-korea.mysql.database.azure.com", //"kiki-deploy.c2gc9pfwihfe.ap-northeast-2.rds.amazonaws.com",
  USER: "kikii@kikib-korea", //"admin",
  PASSWORD: "1733a-sql", //"mysql-1733",
  DB: "dev-kikib", //"deploy-kikib",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
