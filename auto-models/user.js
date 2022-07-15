const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    agreement: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    emp_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    login_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "user_login_id_uindex"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    point: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 100
    },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    app_version: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    manager_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "승무원"
    },
    work_standard: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
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
        name: "user_login_id_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "login_id" },
        ]
      },
      {
        name: "FK_company_TO_user_1",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "FK_company_TO_user_2_idx",
        using: "BTREE",
        fields: [
          { name: "manager_id" },
        ]
      },
    ]
  });
};
