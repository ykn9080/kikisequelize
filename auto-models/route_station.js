const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "route_station",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      iscenter: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      district_cd: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      station_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      station_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      x: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      y: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      station_seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isturn: {
        type: DataTypes.BOOLEAN,
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
    },
    {
      sequelize,
      tableName: "route_station",
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
        {
          name: "FK_route_TO_route_station_1",
          using: "BTREE",
          fields: [{ name: "route_id" }],
        },
      ],
    }
  );
};
