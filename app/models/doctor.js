module.exports = (sequelize, Sequelize,db) => {
  const clinic = sequelize.define("tb_account_dr", {
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
  const doctor = sequelize.define("tb_doctor", {
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
    account_dr_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(64),
    },
    hospital_name: {
      type: Sequelize.STRING(64),
    },
    phone: {
      type: Sequelize.STRING(64),
    },
    mobile: {
      type: Sequelize.STRING(64),
    },
    email: {
      type: Sequelize.STRING(64),
    },
    address_id: {
      type: Sequelize.INTEGER,
    },
    license_number: {
      type: Sequelize.STRING(64),
    },
    setting: {
      type: Sequelize.STRING(5000),
    },
    clinic_setting: {
      type: Sequelize.STRING(5000),
    },
    email_notification: {
      type: Sequelize.STRING(255),
    },
    is_submit_checked: {
      type: Sequelize.INTEGER,
    },
    is_mapping_checked: {
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
  db.doctor = doctor;
  db.clinic = clinic;
  //db.tb_type = tb_type;
  return db;
};
