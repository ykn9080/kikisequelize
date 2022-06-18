module.exports = (sequelize, Sequelize, db) => {
  const tb_account_lab = sequelize.define("tb_account_lab", {
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

  const tb_lab = sequelize.define("tb_lab", {
    index: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    create_date: {
      type: Sequelize.DATE,
    },
    modified_date: {
      type: Sequelize.DATE,
    },
    account_lab_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(64),
    },
    phone: {
      type: Sequelize.STRING(64),
    },
    email: {
      type: Sequelize.STRING(64),
    },
    country: {
      type: Sequelize.INTEGER,
    },
    address1: {
      type: Sequelize.STRING(64),
    },
    address2: {
      type: Sequelize.STRING(64),
    },
    address3: {
      type: Sequelize.STRING(64),
    },
    address4: {
      type: Sequelize.STRING(64),
    },
    zip_code: {
      type: Sequelize.STRING(64),
    },
    setting: {
      type: Sequelize.STRING(10000),
    },
    logo: {
      type: Sequelize.STRING(255),
    },
    lat: {
      type: Sequelize.STRING(50),
    },
    lng: {
      type: Sequelize.STRING(50),
    },
  });

  db.tb_account_lab = tb_account_lab;
  db.tb_lab = tb_lab;
  return db;
};
