module.exports = (sequelize, Sequelize, db) => {
  const tutorial = sequelize.define("tutorial", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    published: {
      type: Sequelize.BOOLEAN,
    },
  });
  db.tutorial = tutorial;
  return db;
};
