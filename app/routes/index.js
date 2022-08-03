const proc = require("../controllers/procedure");
const query = require("../controllers/query");
const crud = require("../controllers/reuseCRUD");
const ctr_notice = require("../controllers/custom/notice");
const ctr_alert = require("../controllers/custom/alert");

const sampledata=require("../util/data1");
const routedriver=require("../util/data");

//const ctr_tutorial= require("../controllers/custom/tutorial.controller");
const auth=require("../middleware/auth")


module.exports = (app) => {
  const models = require("../models");
  //require("./turorial.routes")(app);
  app.use("/api/getQuery", query.getQuery);
  app.use("/api/managerreplacelist", proc.managerLeaveUncheck);
  app.use("/api/managerworkbydateandroute", query.getWorkbyManager);
  app.use("/api/user", query.getUserWithStopWorking);
  app.use("/api/onetime",sampledata,routedriver.fixedupdate);
  
  //app.use("/api/tutorial",auth, ctr_tutorial(models.tutorial));
   app.use("/api/notice",auth, ctr_notice(models.notice));
   app.use("/api/alert",auth, ctr_alert(models.alert));
 
  // app.use("/api/dashboard", crud(db.dashboard));
  // app.use("/api/dashdata", crud(db.dashdata));
};
