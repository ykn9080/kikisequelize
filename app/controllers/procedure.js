const reqres = require("./requestResponse");
const db = require("../models");
const moment = require("moment");

exports.managerReplacelist = (req, res) => {
  if (req.id === undefined) req.id = null;
  let replacement = {
    managerId: req.id,
    routeId: req.body.routeId,
    yearmonth: req.body.yearMonth,
  };
  console.log(replacement);
  reqres.commonQueryBody(
    " request_leave(:managerId, :routeId, :yearmonth)",
    replacement,
    res
  );
};

exports.getWorkbyManager = (req, res) => {
  console.log(req.body);
  let replacement = {
    routeId: req.body.routeId,
    date: req.body.date,
  };
  console.log(replacement);
  reqres.commonQueryBody("workbymanager(:routeId, :date)", replacement, res);
};

exports.userDetail = (req, res) => {
  reqres.commonQueryBody(" user_detail(:id)", req.params, res);
};

exports.findShiftThisMonth = (req, res) => {
  reqres.commonQueryBody(
    "find_shift_this_month(:routeId, :yearMonth)",
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
exports.getRestbyManagerAndYearmonth = (req, res) => {
  if (req.id === undefined) req.id = null;
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "rest_by_manager(:managerId, :routeId, :yearMonth)",
    replacement,
    res
  );
};

exports.dailyBusnumWorknumYearMonth = (req, res) => {
  if (req.id === undefined) req.id = null;
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
  if (req.id === undefined) req.id = null;
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "leave_summary_by_driver(:managerId,:routeId, :date)",
    replacement,
    res
  );
};
exports.motionAnalysis = (req, res) => {
  if (req.id === undefined) req.id = null;
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "motion_analysis(:managerId,:routeId, :yearMonth)",
    replacement,
    res
  );
};

exports.dispatchBasis = (req, res) => {
  let replacement = req.params;
  //  replacement.managerId = req.id;
  reqres.commonQueryBody("dispatch_basis(:routeId, :cdate)", replacement, res);
};
exports.dispatchHistory = (req, res) => {
  let replacement = req.params;
  reqres.commonQueryBody(
    "dispatch_history(:routeId, :weekDay)",
    replacement,
    res
  );
};
exports.dispatchList1 = async (req, res) => {
  if (req.id === undefined) req.id = null;
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
  option.replacements.date = moment(option.replacements.datetime).format(
    "YYYY-MM-DD"
  );

  delete option.replacements.datetime;
  queryOrProc = "CALL leave_summary_by_driver(:managerId,:routeId, :date)";

  const rtn1 = await db.sequelize.query(queryOrProc, option);
  let rtnn = Object.values(rtn);
  let rtnn1 = Object.values(rtn1);

  await Promise.all(
    rtnn.map((k, i) => {
      Object.values(rtn1).forEach((v) => {
        if (k.driverId === v.driverId) {
          k.leave_sum = v.leave_sum;
          k.last_work_date = v.last_work_date;
          k.work_inarow = v.work_inarow;
          rtnn.splice(i, 1, k);
        }
      });
    })
  );
  await reqres.commonReturn(rtnn1, res);
};
exports.dispatchList = async (req, res) => {
  if (req.id === undefined) req.id = null;

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

  await Promise.all(
    rtnn.map((k, i) => {
      Object.values(rtn1).forEach((v) => {
        if (k.driverId === v.driverId) {
          k.leave_sum = v.leave_sum;
          k.last_work_date = v.last_work_date;
          k.work_inarow = v.work_inarow;
          rtnn.splice(i, 1, k);
        }
      });
    })
  );
  await reqres.commonReturn(rtnn, res);
};
exports.routeListByManager = (req, res) => {
  if (req.id === undefined) req.id = null;
  let replacement = req.params;
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "route_list_by_manager(:managerId,:placeId, :datetime)",
    replacement,
    res
  );
};
exports.getBusArrivalStation = (req, res) => {
  const rq = req.path.split("/");
  let replacement = { routeId: -1, date: "1900-01-01" };
  if (rq[1]) replacement.routeId = rq[1];
  if (rq[2]) replacement.cdate = rq[2];

  reqres.commonQueryBody(
    "get_bus_arrival_station(:routeId,:cdate)",
    replacement,
    res
  );
};

exports.simpleTest = (req, res) => {
  let replacement = {};
  reqres.commonQueryBody("simple_test()", replacement, res);
};
