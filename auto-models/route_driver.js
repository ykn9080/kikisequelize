const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('route_driver', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    shift: {
      type: DataTypes.STRING(255),
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
    route_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'route',
        key: 'id'
      }
    },
    fixed_start_order: {
      type: DataTypes.BIGINT,
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
    tableName: 'route_driver',
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
        name: "FK_bus_TO_route_driver_1",
        using: "BTREE",
        fields: [
          { name: "bus_id" },
        ]
      },
      {
        name: "FK_route_TO_route_driver_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_route_driver_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
      {
        name: "FK_user_TO_route_driver_2",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
    ]
  });
};
