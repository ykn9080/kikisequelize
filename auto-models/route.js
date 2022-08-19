const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "route",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "company",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      code: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      avg_break: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      min_break: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      manager_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      operation_time: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      business_place_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "business_place",
          key: "id",
        },
      },
      route_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      api_route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "route",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_company_TO_route_1",
          using: "BTREE",
          fields: [{ name: "company_id" }],
        },
        {
          name: "FK_user_TO_route_1",
          using: "BTREE",
          fields: [{ name: "manager_id" }],
        },
        {
          name: "FK_business_place_TO_route_1_idx",
          using: "BTREE",
          fields: [{ name: "business_place_id" }],
        },
      ],
    }
  );
};
