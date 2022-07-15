const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('route_setting', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    work_standard: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    route_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'route',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cnt_mon: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_tue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_wed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_thu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_fri: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_sat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cnt_sun: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'route_setting',
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
        name: "FK_route_TO_route_setting_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "FK_user_TO_route_setting_1",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
    ]
  });
};
