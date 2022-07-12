const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lost', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pick_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    pick_place: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    return_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    emp_confirm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    store_place: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    picker_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'lost',
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
        name: "FK_user_TO_lost_1",
        using: "BTREE",
        fields: [
          { name: "picker_id" },
        ]
      },
    ]
  });
};
