const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dispatch', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    break_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bus_round: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actual_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bus_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'bus',
        key: 'id'
      }
    },
    driver_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    request_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'schedule_request',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "true"
    }
  }, {
    sequelize,
    tableName: 'dispatch',
    timestamps: false,
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
        name: "FK_bus_TO_dispatch_1",
        using: "BTREE",
        fields: [
          { name: "bus_id" },
        ]
      },
      {
        name: "FK_user_TO_dispatch_1",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
      {
        name: "FK_schedule_request_TO_dispatch_1",
        using: "BTREE",
        fields: [
          { name: "request_id" },
        ]
      },
    ]
  });
};
