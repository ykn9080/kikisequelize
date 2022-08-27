const reqres = require("./requestResponse");
const db = require("../models");

exports.managerReplacelist = (req, res) => {
  let replacement = {
    managerId: req.id,
    routeId: req.body.routeId,
    yearmonth: req.body.yearMonth,
  };

  reqres.commonQueryBody(
    " request_leave(:managerId, :routeId, :yearmonth)",
    replacement,
    res
  );
};

exports.getWorkbyManager = (req, res) => {
  let replacement = {
    routeId: req.body.routeId,
    date: req.body.date,
  };
  reqres.commonQueryBody("workbymanager(:routeId, :date)", replacement, res);
};

exports.userDetail = (req, res) => {
  reqres.commonQueryBody(" user_detail(:id)", req.params, res);
};

exports.findShiftThisMonth = (req, res) => {
  reqres.commonQueryBody(
    "find_shift_this_month(:routeId, :date)",
    req.params,
    res
  );
};
exports.leaveDateByDriver = (req, res) => {
  reqres.commonQueryBody(
    "leave_date_by_driver(:routeId, :shift, :yearMonth)",
    req.params,
    res
  );
};
exports.dailyBusnumWorknumYearMonth = (req, res) => {
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "daily_busnum_worknum_yearMonth(:managerId, :routeId, :yearMonth)",
    replacement,
    res
  );
};
exports.schedulePeriodFind = (req, res) => {
  reqres.commonQueryBody(
    "schedule_period_find(:routeId, :yearMonth)",
    req.params,
    res
  );
};

exports.leaveSummaryByDriver = (req, res) => {
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "leave_summary_by_driver(:managerId,:routeId, :date)",
    replacement,
    res
  );
};
exports.dispatchList1 = (req, res) => {
  console.log(req.params);
  reqres.commonQueryBody("dispatch_list(:routeId, :datetime)", req.params, res);
};
exports.dispatchList = async (req, res) => {
  let option = {
    replacements: req.params,
    type: db.sequelize.QueryTypes["select"],
    plain: true,
  };
  let queryOrProc = "CALL dispatch_list(:routeId, :datetime)";
  const rtn = await db.sequelize.query(queryOrProc, option);
  option = {
    replacements: req.params,
    type: db.sequelize.QueryTypes["select"],
    plain: true,
  };
  option.replacements.managerId = req.id;
  option.replacements.date = option.replacements.datetime;
  queryOrProc = "CALL leave_summary_by_driver(:managerId,:routeId, :date)";
  const rtn1 = await db.sequelize.query(queryOrProc, option);
  let rtnn = Object.values(rtn);
  let rtnn1 = Object.values(rtn1);
  rtnn.map((k, i) => {
    Object.values(rtn1).forEach((v) => {
      if (k.driverId === v.driverId) {
        k.leave_sum = v.leave_sum;
        k.last_work_date = v.last_work_date;
        k.work_inarow = v.work_inarow;
        rtnn.splice(i, 1, k);
      }
    });
  });
  reqres.commonReturn(rtnn, res);
};
exports.routeListByManager = (req, res) => {
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "route_list_by_manager(:managerId,:placeId, :datetime)",
    replacement,
    res
  );
};
exports.simpleTest = (req, res) => {
  let replacement = {};
  reqres.commonQueryBody("simple_test()", replacement, res);
};
