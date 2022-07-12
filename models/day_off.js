const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('day_off', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    work_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    },
    origin_leave: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    driver_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    to_work: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'work',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'day_off',
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
        name: "FK_user_TO_day_off_2_idx",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
      {
        name: "FK_work_TO_day_off_1",
        using: "BTREE",
        fields: [
          { name: "work_id" },
        ]
      },
      {
        name: "FKqhejx0mg884sosjv0pgsh0uei",
        using: "BTREE",
        fields: [
          { name: "to_work" },
        ]
      },
    ]
  });
};
