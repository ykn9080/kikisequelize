const proc = require("../controllers/procedure");
const query = require("../controllers/query");
const crud = require("../controllers/reuseCRUD");
const ctr_notice = require("../controllers/custom/notice");
const ctr_alert = require("../controllers/custom/alert");
const log = require("../util/cron");
const logresult = require("../../swagger/swaggerMaker");
const sampledata = require("../util/data1");
const routedriver = require("../util/data");

//const ctr_tutorial= require("../controllers/custom/tutorial.controller");
const auth = require("../middleware/auth");

module.exports = (app) => {
  const models = require("../models");
  //require("./turorial.routes")(app);
  app.use("/api/getQuery", query.getQuery);
  app.use("/api/managerreplacelist", auth, proc.managerReplacelist);
  app.use("/api/managerworkbydateandroute", proc.getWorkbyManager);
  app.use("/api/findshiftthismonth", proc.findShiftThisMonth);
  app.use("/api/leavedatebydriver", proc.leaveDateByDriver);
  app.use(
    "/api/dailybusnumworknumyearmonth",
    auth,
    proc.dailyBusnumWorknumYearMonth,
    callback
  );
  app.use("/api/scheduleperiodfind", proc.schedulePeriodFind);
  app.use("/api/user", proc.userDetail);
  //app.use("/api/onetime", sampledata, routedriver.fixedupdate);
  app.use("/api/rest/driver", auth, query.getRestbyDriverAndYearmonth);
  app.use("/api/rest/manager", auth, query.getRestbyManagerAndYearmonth);

  //app.use("/api/tutorial", ctr_tutorial(models.tutorial));
  app.use("/api/notice", auth, ctr_notice(models.notice));
  app.use("/api/alert", auth, ctr_alert(models.alert));
  app.use("/api/log", log.queryLog);
  app.use("/api/logresult", logresult.swaggerMaker);

  // app.use("/api/dashboard", crud(db.dashboard));
  // app.use("/api/dashdata", crud(db.dashdata));
};
const callback = (req, res, next) => {
  console.log("callback called from next");
};
