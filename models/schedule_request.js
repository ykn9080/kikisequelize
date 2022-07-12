const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule_request', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    operation_time: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    route_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'route',
        key: 'id'
      }
    },
    pre_request_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'schedule_request',
        key: 'id'
      }
    },
    manager_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    dispatch_created: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    pre_dispatch_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'schedule_request',
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
        name: "FK_route_TO_schedule_request_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_schedule_request_TO_schedule_request_1",
        using: "BTREE",
        fields: [
          { name: "pre_request_id" },
        ]
      },
      {
        name: "FK_user_TO_schedule_request_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
    ]
  });
};
