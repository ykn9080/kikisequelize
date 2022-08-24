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
      bus_1: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      bus_2: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      remain_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      remain_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      check_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isstart: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "bus_arrival",
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
