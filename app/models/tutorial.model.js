module.exports = (sequelize, Sequelize) => {
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
  //db.tutorial = tutorial;
  return tutorial;
};
