module.exports = {
  HOST: "kiki-deploy.c2gc9pfwihfe.ap-northeast-2.rds.amazonaws.com",
  USER: "admin",
  PASSWORD: "mysql-1733",
  DB: "deploy-kikib",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
