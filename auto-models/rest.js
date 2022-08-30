const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "rest",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      driver_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      route_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "route",
          key: "id",
        },
      },
      isauto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "rest",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "driver_id",
          using: "BTREE",
          fields: [{ name: "driver_id" }],
        },
        {
          name: "route_id",
          using: "BTREE",
          fields: [{ name: "route_id" }],
        },
      ],
    }
  );
};
