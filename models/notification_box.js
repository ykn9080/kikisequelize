const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification_box', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    dispatch_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    work_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    replace_request_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    manager_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    manager_confirm: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'notification_box',
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
    ]
  });
};
