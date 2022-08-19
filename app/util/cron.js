const cronJob = require("cron").CronJob;
const db = require("../models");
var fs = require("fs");
const reqres = require("../controllers/requestResponse");
const path = "./app/util/cronhistory.txt";
const jobs = [
  {
    title: "test1234",
    pattern: "*/10 * * * * *",
    message: "this runs ever 15 seconds",
    action: () => {
      const replacement = {};
      reqres.noResponseBody("simpletest()", replacement, "INSERT", next);
    },
  },
  // {
  //    title: "승무교환",
  //   pattern: "0 2 * * * *",
  //   message: "everyday at 2:00 am",
  //   action: () => {
  //     const replacement = {};
  //     reqres.commonQueryBody("simpletest()", replacement,null, callback);
  //   },
  // },
];
var query = "select * from cron_timer where isactive=1";
var option = { type: db.sequelize.QueryTypes.SELECT };
db.sequelize.query(query, option).then((resp) => {
  //console.log(resp);
  // if(resp.length>0){
  // resp.forEach((job) => {
  //   new cronJob(job.pattern, () => {
  //     console.log(job.message);
  //     eval(job.action)();
  //   }).start();
  // });
  //}
});

const next = (queryname, result) => {
  console.log("callback called!!!" + queryname + " result: " + result);
  fs.appendFile(path, logMake(queryname, result), (err) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log('The "data to append" was appended to file!');
  });
};
const logMake = (queryname, result) => {
  return (
    "query: " +
    queryname +
    ";result: " +
    result +
    ";" +
    ";date: " +
    Date() +
    ";\n"
  );
};
exports.queryLog = (req, res) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
};
