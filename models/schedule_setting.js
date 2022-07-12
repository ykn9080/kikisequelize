const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule_setting', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    route_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'route',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    work_creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    day_off_request_start: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    day_off_request_end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    work_notice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    schedule_check_term: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    manager_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'schedule_setting',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK_route_TO_schedule_setting_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_schedule_setting_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
    ]
  });
};
