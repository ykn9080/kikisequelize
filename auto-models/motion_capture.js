const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "motion_capture",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      detection_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bus_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      isbelt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      iscellphone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      image_id: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "motion_capture",
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
