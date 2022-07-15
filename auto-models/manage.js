const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manage', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    },
    business_place_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'business_place',
        key: 'id'
      }
    },
    manager: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'manage',
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
        name: "FK_business_place_TO_manage_1",
        using: "BTREE",
        fields: [
          { name: "business_place_id" },
        ]
      },
      {
        name: "FK_route_TO_manage_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_manage_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
      {
        name: "FK_user_TO_manage_2_idx",
        using: "BTREE",
        fields: [
          { name: "manager" },
        ]
      },
    ]
  });
};
