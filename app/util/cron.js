const cronJob = require("cron").CronJob;
const db = require("../models");
var fs = require("fs");
const reqres = require("../controllers/requestResponse");
const { default: axios } = require("axios");
const path = "./app/util/cronhistory.txt";
const jobs = [
  {
    title: "test1234",
    pattern: "*/10 * * * * *",
    message: "this runs ever 10 seconds",
    action: () => {
      axios.get("http://kikibus.iptime.org:8484/api/busLocation");
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
let cronList = [];
const cronStart = () => {
  var query = "select * from cron_timer where isactive=1";
  var option = { type: db.sequelize.QueryTypes.SELECT };
  db.sequelize.query(query, option).then((resp) => {
    //console.log(resp);
    if (resp.length > 0) {
      resp.forEach((job) => {
        const cJob = new cronJob(job.pattern, () => {
          //console.log(job.message, new Date());
          eval(job.action)();
        });
        cJob.start();
        cronList.push(cJob);
      });
    }
  });
  // new cronJob(jobs[0].pattern, () => {
  //   console.log(jobs[0].message, new Date());
  //   axios.get("http://localhost:8484/api/checkbusarrival").catch(function (err) {
  //     console.log("axios err", err); // 에러 처리 내용
  //   });
  // }).start();
};
const cronStop = (req, res) => {
  cronList.forEach((job) => {
    console.log(job.message, new Date(), " stopped!!!");
    job.stop();
  });
};

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
    //console.log(data);
  });
};

module.exports.cronStart = cronStart;
module.exports.cronStop = cronStop;
