module.exports = (sequelize, Sequelize, db) => {
  const couponhistory = sequelize.define("tb_coupon_history", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_dr_id: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATE,
    },
    isuse: {
      type: Sequelize.BOOLEAN,
    },
    num: {
      type: Sequelize.INTEGER,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
  });

  db.couponhistory = couponhistory;

  return db;
};
