module.exports = (sequelize, Sequelize) => {
  const lab = sequelize.define("tb_account_lab", {
    account_lab_id: {
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
    email_notification: {
      type: Sequelize.STRING(64),
    },
    is_submit_checked: {
      type: Sequelize.INTEGER,
    },
    my_last_selection: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return lab;
};
