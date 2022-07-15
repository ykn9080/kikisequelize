const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notice', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category: {
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
    place_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'business_place',
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
    hit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    writer_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    piclinkarray: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    youtubearray: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    urgent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'company_group',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'notice',
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
        name: "FK_company_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "FK_user_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "writer_id" },
        ]
      },
      {
        name: "FK_business_place_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
      {
        name: "FK_route_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "route_id" },
        ]
      },
      {
        name: "fk_group_id",
        using: "BTREE",
        fields: [
          { name: "group_id" },
        ]
      },
    ]
  });
};
