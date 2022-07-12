const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('replace_request', {
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
    req_driver_work_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    },
    req_driver_leave_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    },
    res_driver_leave_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    },
    res_driver_work_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    },
    req_driver_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NONE"
    },
    res_driver_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NONE"
    },
    manager_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NONE"
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
    tableName: 'replace_request',
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
        name: "FK_route_TO_replace_request_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_replace_request_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
      {
        name: "FK_work_TO_replace_request_1",
        using: "BTREE",
        fields: [
          { name: "req_driver_work_id" },
        ]
      },
      {
        name: "FK_work_TO_replace_request_2",
        using: "BTREE",
        fields: [
          { name: "req_driver_leave_id" },
        ]
      },
      {
        name: "FK_work_TO_replace_request_3",
        using: "BTREE",
        fields: [
          { name: "res_driver_leave_id" },
        ]
      },
      {
        name: "FK_work_TO_replace_request_4",
        using: "BTREE",
        fields: [
          { name: "res_driver_work_id" },
        ]
      },
    ]
  });
};
