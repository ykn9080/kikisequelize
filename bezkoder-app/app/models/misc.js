module.exports = (sequelize, Sequelize, db) => {
  const alarm = sequelize.define("tb_alarm", {
    alarm_id: {
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
    reciver_id: {
      type: Sequelize.INTEGER,
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    alarm_code_id: {
      type: Sequelize.INTEGER,
    },
  });
  const revisionrequest = sequelize.define("tb_revision_request", {
    revision_request_id: {
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

    comment: {
      type: Sequelize.STRING(10000),
    },

    image_list: {
      type: Sequelize.STRING(10000),
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    service_history_id: {
      type: Sequelize.INTEGER,
    },
    type_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
  });
  const comment = sequelize.define("tb_comment", {
    comment_id: {
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
    content: {
      type: Sequelize.STRING(10000),
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    type_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
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
  // const attachfile = sequelize.define("tb_attach_file", {
  //   service_worker_id: {
  //     type: Sequelize.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   created_date: {
  //     type: Sequelize.DATE,
  //   },
  //   modified_date: {
  //     type: Sequelize.DATE,
  //   },
  //   service_id: {
  //     type: Sequelize.INTEGER,
  //   },
  //   info: {
  //     type: Sequelize.STRING(10000),
  //   },
  // });

  const submitchange = sequelize.define("tb_submit_change", {
    submit_change_id: {
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
    comment: {
      type: Sequelize.STRING(10000),
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
    service_history_id: {
      type: Sequelize.INTEGER,
    },

    type_id: {
      type: Sequelize.INTEGER,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
  });
  const onecheck = sequelize.define("tb_onecheck", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    version: {
      type: Sequelize.STRING(10),
    },
    created_date: {
      type: Sequelize.DATE,
    },
    modified_date: {
      type: Sequelize.DATE,
    },
  });

  db.alarm = alarm;
  db.revisionrequest = revisionrequest;
  db.comment = comment;
  db.serviceworker = serviceworker;
  db.submitchange = submitchange;
  db.onecheck = onecheck;

  return db;
};
