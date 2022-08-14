const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "cron_schedule",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      bus_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "bus",
          key: "id",
        },
      },
      driver_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      change_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      route_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "route",
          key: "id",
        },
      },
      shift: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      driver_bus_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "bus",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "cron_schedule",
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
