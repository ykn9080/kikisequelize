const reqres = require("./requestResponse");

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
  const replacement = reqres.replacementPathReturn(req, ["driverId"]);
  reqres.commonQueryBody(" user_detail(:driverId)", replacement, res);
};

exports.findShiftThisMonth = (req, res) => {
  const replacement = reqres.replacementPathReturn(req, ["routeId", "indate"]);
  reqres.commonQueryBody(
    "find_shift_this_month(:routeId, :indate)",
    replacement,
    res
  );
};
exports.leaveDateByDriver = (req, res) => {
  const replacement = reqres.replacementPathReturn(req, ["routeId", "Shift"]);
  reqres.commonQueryBody(
    "leave_date_by_driver(:routeId, :Shift)",
    replacement,
    res
  );
};
exports.dailyBusnumWorknumYearMonth = (req, res, next) => {
  let replacement = reqres.replacementPathReturn(req, ["routeId", "yearMonth"]);
  replacement.managerId = req.id;
  reqres.commonQueryBody(
    "daily_busnum_worknum_yearMonth(:managerId, :routeId, :yearMonth)",
    replacement,
    res,
    next
  );
};
exports.schedulePeriodFind = (req, res) => {
  const replacement = reqres.replacementPathReturn(req, [
    "routeId",
    "yearMonth",
  ]);
  reqres.commonQueryBody(
    "schedule_period_find(:routeId, :yearMonth)",
    replacement,
    res
  );
};

exports.simpleTest = (req, res) => {
  let replacement = {};
  reqres.commonQueryBody("simple_test()", replacement, res);
};
