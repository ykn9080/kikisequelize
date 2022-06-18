module.exports = (sequelize, Sequelize, db) => {
  const dashboard = sequelize.define("dashboard", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: Sequelize.STRING(100),
    },
    data: {
      type: Sequelize.TEXT("long"),
    },
  });
  const dashdata = sequelize.define("dashdata", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: Sequelize.INTEGER,
    },
    country: {
      type: Sequelize.STRING(100),
    },
    date: {
      type: Sequelize.DATE,
    },
    usertype: {
      type: Sequelize.STRING(100),
    },
    datatype: {
      type: Sequelize.STRING(100),
    },
  });

  db.dashboard = dashboard;
  db.dashdata = dashdata;

  return db;
};
