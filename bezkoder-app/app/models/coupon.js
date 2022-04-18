module.exports = (sequelize, Sequelize, db) => {
  const couponhistorybuy = sequelize.define("couponhistorybuy", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: Sequelize.INTEGER,
    },
    comp_id: {
      type: Sequelize.INTEGER,
    },
    islab: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATE,
    },
    coupontype: {
      type: Sequelize.INTEGER,
    },
  });
  const couponhistoryuse = sequelize.define("couponhistoryuse", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: Sequelize.INTEGER,
    },
    islab: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATE,
    },
    number: {
      type: Sequelize.INTEGER,
    },
    service_id: {
      type: Sequelize.INTEGER,
    },
  });
  const coupontype = sequelize.define("coupontype", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.DATE,
    },
    title: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    number: {
      type: Sequelize.INTEGER,
    },
    isactive: {
      type: Sequelize.BOOLEAN,
    },
    order: {
      type: Sequelize.INTEGER,
    },
  });

  couponhistorybuy.associate = () => {
    couponhistorybuy.belongsTo(coupontype, {
      foreignKey: "coupontype",
      as: "Coupontype", // Changes applied here
      onDelete: "CASCADE",
    });
  };
  db.couponhistorybuy = couponhistorybuy;
  db.couponhistoryuse = couponhistoryuse;
  db.coupontype = coupontype;

  return db;
};