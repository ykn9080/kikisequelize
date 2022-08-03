const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alert', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    referTable: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    referId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    reason: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'alert',
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }
    ]
  });
};
