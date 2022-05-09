module.exports = (sequelize, Sequelize, db) => {
  const service = sequelize.define("tb_service", {
    service_id: {
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
    patient_id: {
      type: Sequelize.INTEGER,
    },
    service_type_id: {
      type: Sequelize.INTEGER,
    },
    status_id: {
      type: Sequelize.INTEGER,
    },
    info: {
      type: Sequelize.STRING(15000),
    },
    auto_save: {
      type: Sequelize.INTEGER,
    },
    memo: {
      type: Sequelize.STRING(5000),
    },
    tracking_id: {
      type: Sequelize.INTEGER,
    },
    tracking_number: {
      type: Sequelize.STRING(64),
    },
    account_lab_id: {
      type: Sequelize.INTEGER,
    },
  });
  const servicehistory = sequelize.define("tb_service_history", {
    service_history_id: {
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
    type_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    status_id: {
      type: Sequelize.INTEGER,
    },
    is_manual: {
      type: Sequelize.INTEGER,
    },
  });
  const serviceinfo = sequelize.define("tb_service_info", {
    service_info_id: {
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
    service_id: {
      type: Sequelize.INTEGER,
    },
    service_history_id: {
      type: Sequelize.INTEGER,
    },
    info: {
      type: Sequelize.STRING(10000),
    },
  });
  const serviceworker = sequelize.define("tb_service_worker", {
    service_worker_id: {
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
    service_id: {
      type: Sequelize.INTEGER,
    },
    info: {
      type: Sequelize.STRING(10000),
    },
  });

  //   couponhistorybuy.associate = () => {
  //     couponhistorybuy.belongsTo(coupontype, {
  //       foreignKey: "coupontype",
  //       as: "Coupontype", // Changes applied here
  //       onDelete: "CASCADE",
  //     });
  //   };
  db.service = service;
  db.servicehistory = servicehistory;
  db.serviceinfo = serviceinfo;
  db.serviceworker = serviceworker;

  return db;
};
