module.exports = (sequelize, Sequelize) => {
  const doctor = sequelize.define("tb_account_dr", {
    account_dr_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_date: {
      type: Sequelize.DATE,
    },
    modified_date: {
      type: Sequelize.DATE,
    },
    login_id: {
      type: Sequelize.STRING(45),
    },
    login_pw: {
      type: Sequelize.STRING(500),
    },
    parent_id: {
      type: Sequelize.INTEGER,
    },
  });
  const tb_type = sequelize.define("tb_type", {
    type_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_date: {
      type: Sequelize.DATE,
    },
    modified_date: {
      type: Sequelize.DATE,
    },
    table_name: {
      type: Sequelize.STRING(64),
    },
  });
  //db.doctor = doctor;
  //db.tb_type = tb_type;
  return doctor;
};
