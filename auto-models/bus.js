const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bus', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NORMAL"
    },
    bus_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "GENERAL"
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'company',
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
    tableName: 'bus',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
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
        name: "FK_company_TO_bus_1",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "FK_route_TO_bus_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_bus_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
    ]
  });
};
