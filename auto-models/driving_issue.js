const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('driving_issue', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    img_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bus_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'bus',
        key: 'id'
      }
    },
    driver_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    device_serial_num: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    detect_time: {
      type: DataTypes.DATE,
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
    use_time: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    video_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'driving_issue',
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
        name: "FK_company_TO_driving_issue_1",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "FKc1f1novo2le536sgukiqj5n7o",
        using: "BTREE",
        fields: [
          { name: "bus_id" },
        ]
      },
      {
        name: "FKn27da0f21f07y6q9hggslhyx8",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
    ]
  });
};
