const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bus_arrival",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      api_route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bus_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      station_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      station_seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      check_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "bus_arrival_station",
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
