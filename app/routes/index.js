const proc = require("../controllers/procedure");
const query = require("../controllers/query");
const crud = require("../controllers/reuseCRUD");
const ctr_notice = require("../controllers/custom/notice");
const ctr_alert = require("../controllers/custom/alert");
const log = require("../util/cron");
const logresult = require("../../swagger/swaggerMaker");
const sampledata = require("../util/data1");
const routedriver = require("../util/data");
const busLocation = require("../controllers/custom/busLocation");

//const ctr_tutorial= require("../controllers/custom/tutorial.controller");
const auth = require("../middleware/auth");

module.exports = (app) => {
  const models = require("../models");
  //require("./turorial.routes")(app);
  app.use("/api/getQuery", query.getQuery);
  app.use("/api/managerreplacelist", auth, proc.managerReplacelist);
  app.use("/api/managerworkbydateandroute", proc.getWorkbyManager);
  app.use("/api/findshiftthismonth/:routeId/:date", proc.findShiftThisMonth);
  app.use("/api/leavedatebydriver/:routeId/:shift", proc.leaveDateByDriver);
  app.use(
    "/api/leaveSummaryByDriver/:routeId/:date",
    auth,
    proc.leaveSummaryByDriver
  );
  app.use(
    "/api/dailybusnumworknumyearmonth/:routeId/:yearMonth",
    auth,
    proc.dailyBusnumWorknumYearMonth
  );
  app.use(
    "/api/scheduleperiodfind/:routeId/:yearMonth",
    proc.schedulePeriodFind
  );
  app.use("/api/dispatchlist/:routeId/:date", proc.dispatchList);
  app.use("/api/user/:id", proc.userDetail);
  app.use(
    "/api/rest/driver/:yearMonth",
    auth,
    query.getRestbyDriverAndYearmonth
  );
  app.use(
    "/api/rest/manager/:yearMonth/:routeId",
    auth,
    query.getRestbyManagerAndYearmonth
  );

  //app.use("/api/tutorial", ctr_tutorial(models.tutorial));
  app.use("/api/notice", auth, ctr_notice(models.notice));
  app.use("/api/alert", auth, ctr_alert(models.alert));
  app.use("/api/log", log.queryLog);
  app.use("/api/logresult", logresult.swaggerMaker);
  app.use("/api/buslocation/:routeId", busLocation.getBusLocation);
  app.use("/api/busEdge/:routeId", busLocation.getBusLocationEdge);

  // app.use("/api/dashboard", crud(db.dashboard));
  // app.use("/api/dashdata", crud(db.dashdata));
};
