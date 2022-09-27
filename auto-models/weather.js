const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "weather",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      max_temp: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      min_temp: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      avg_temp: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      rain: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      snow: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "weather",
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
