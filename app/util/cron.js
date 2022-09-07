var cron = require("node-cron");
const db = require("../models");
require("dotenv").config();
var fs = require("fs");
const reqres = require("../controllers/requestResponse");
const { default: axios } = require("axios");
const path = "./app/util/cronhistory.txt";

console.log("server_url:", process.env.SERVER_URL);
const jobs = [
  {
    title: "test1234",
    pattern: "*/10 * * * * *",
    message: "this runs ever 10 seconds",
    action: () => {
      axios.get(`${process.env.SERVER_URL}/api/busLocation`);
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
const cronStartAll = async () => {
  var query = "select * from cron_timer where isactive=1";
  var option = { type: db.sequelize.QueryTypes.SELECT };
  var obj = {};
  db.sequelize.query(query, option).then((resp) => {
    //console.log(resp);
    if (resp.length > 0) {
      resp.forEach((job) => {
        if (job.isactive != 1) return;
        obj = {};

        var cjob = cron.schedule(
          job.pattern,
          () => {
            eval(job.action)();
          },
          {
            scheduled: false,
          }
        );

        obj.id = job.id;
        obj.title = job.title;
        obj.stime = new Date();
        obj.job = cjob;
        cronList.push(obj);
        cjob.start();
      });
    }

    console.log(cronList);
  });
};
const cronStopAll = (req, res) => {
  cronList.map((job) => {
    job.job.stop();
  });
};

const cronStart = async (req, res) => {
  const cronid = req.params.id;
  const job = await db["cron_timer"].findByPk(cronid);

  if (job) {
    //const job = await db["cron_timer"].findByPk(cronid);
    var cjob = cron.schedule(
      job.pattern,
      () => {
        eval(job.action)();
      },
      {
        scheduled: false,
      }
    );
    var obj = {};
    obj.id = job.id;
    obj.title = job.title;
    obj.stime = new Date();
    obj.job = cjob;
    job.isactive = 1;
    db["cron_timer"].update(job, {
      where: { id: job.id },
    });
    addOrReplace(cronList, cjob);
  }
};
const cronStop = (req, res) => {
  const cronid = req.params.id;
  console.log(cronid);
  const job = cronList.find((job) => job.id == cronid);
  console.log(job);
  if (job) job.job.stop();
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
/**
 * array안의 object를 있으면 update, 없으면 insert함
 * @param {*} arr
 * @param {*} newObj
 * @returns
 */
function addOrReplace(arr, newObj) {
  return [...arr.filter((obj) => obj.uid !== newObj.uid), { ...newObj }];
}
module.exports.cronStartAll = cronStartAll;
module.exports.cronStopAll = cronStopAll;
module.exports.cronStart = cronStart;
module.exports.cronStop = cronStop;
