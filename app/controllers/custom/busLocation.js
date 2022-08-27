const db = require("../../models");
var xml2js = require("xml2js");
const _ = require("lodash");
const axios = require("axios");
const convert = require("../../middleware/CamelSnake");
const reqres = require("../requestResponse");

const getBusLocation = async (req, res) => {
  let replacement = req.params;
  const routeId = req.params.routeId;
  const serviceKey =
    "jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";
  const url = `http://apis.data.go.kr/6410000/buslocationservice/getBusLocationList`;
  // find api_route_id from route_id
  const routeRow = await db["route"].findByPk(routeId);
  const returnObj = (k) => {
    return {
      station_id: parseInt(k.stationId[0]),
      station_seq: parseInt(k.stationSeq[0]),
      api_route_id: parseInt(k.routeId[0]),
      bus_number: k.plateNo[0],
    };
  };
  const xml = await axios.get(
    `${url}?serviceKey=${serviceKey}&routeId=${routeRow.api_route_id}`
  );

  const result = xmlParse(xml.data, "busLocationList", returnObj);
  const stations = await db["routeStation"].findAll({
    where: { route_id: routeId },
    raw: true,
  });
  stations.map((k, i) => {
    k["bus_arrival"] = 0;
    k["bus_number"] = null;
    result.map((s, j) => {
      if (k.station_id === s.station_id) {
        k.bus_arrival = 1;
        k.bus_number = s.bus_number;
      }
    });
    stations.splice(i, 1, convert.toCamel(k));
  });

  const rtn1 = {
    status: 200,
    message: "success",
    object: stations,
  };

  return res.status(200).send(rtn1);
};

const getBusLocationEdge = async (req, res) => {
  let replacement = req.params;
  const routeId = req.params.routeId;
  const serviceKey =
    "jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";
  const url = `http://apis.data.go.kr/6410000/buslocationservice/getBusLocationList`;
  // find api_route_id from route_id
  const routeRow = await db["route"].findByPk(routeId);
  const returnObj = (k) => {
    return {
      station_id: parseInt(k.stationId[0]),
      station_seq: parseInt(k.stationSeq[0]),
      api_route_id: parseInt(k.routeId[0]),
      bus_number: k.plateNo[0],
    };
  };
  const xml = await axios.get(
    `${url}?serviceKey=${serviceKey}&routeId=${routeRow.api_route_id}`
  );

  const result = xmlParse(xml.data, "busLocationList", returnObj);
  const stations = await db["routeStation"].findAll({
    where: { route_id: routeId },
    raw: true,
  });
  stations.map((k, i) => {
    k["bus_arrival"] = 0;
    k["bus_number"] = null;
    result.map((s, j) => {
      if (k.station_id === s.station_id) {
        k.bus_arrival = 1;
        k.bus_number = s.bus_number;
      }
    });
    stations.splice(i, 1, convert.toCamel(k));
  });

  const rtn1 = {
    status: 200,
    message: "success",
    object: stations,
  };

  return res.status(200).send(rtn1);
};

const checkBusArrival = async (req, res) => {
  let replacement = req.params;
  const routeId = req.params.routeId;
  const serviceKey =
    "jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";
  const url = `http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList`;

  const busStopArr = [
    { key: 208000096, start: 0 },
    { key: 208000097, start: 0 },
    { key: 208000132, start: 0 },
    { key: 208000195, start: 0 },
    { key: 208000263, start: 0 },
    { key: 209000053, start: 0 },
    { key: 224000626, start: 0 },
    { key: 225000426, start: 0 },
    { key: 225000429, start: 0 },
    { key: 226000155, start: 0 },
    { key: 226000207, start: 0 },
    { key: 277101753, start: 0 },
    { key: 277102421, start: 0 },
    { key: 277102718, start: 0 },
    { key: 277102719, start: 0 },
    { key: 277102720, start: 0 },
    { key: 277102746, start: 0 },
    { key: 277103101, start: 0 },
    { key: 277104392, start: 0 },
    { key: 209000076, start: 1 },
    { key: 277102421, start: 1 },
    { key: 208000027, start: 1 },
    { key: 225000180, start: 1 },
    { key: 224000876, start: 1 },
    { key: 208000236, start: 1 },
    { key: 277102717, start: 1 },
    { key: 225000430, start: 1 },
    { key: 225000191, start: 1 },
    { key: 226000318, start: 1 },
    { key: 225000010, start: 1 },
    { key: 208000264, start: 1 },
    { key: 226000206, start: 1 },
    { key: 225000425, start: 1 },
    { key: 277103100, start: 1 },
  ];

  const returnObj = (k, time1, start) => {
    return {
      api_route_id: parseInt(k.routeId[0]),
      remain_1: isNaN(parseInt(k.predictTime1[0]))
        ? null
        : parseInt(k.predictTime1[0]),
      remain_2: isNaN(parseInt(k.predictTime2[0]))
        ? null
        : parseInt(k.predictTime2[0]),

      stop_1: isNaN(parseInt(k.locationNo1[0]))
        ? null
        : parseInt(k.locationNo1[0]),
      stop_2: isNaN(parseInt(k.locationNo2[0]))
        ? null
        : parseInt(k.locationNo2[0]),
      bus_1: k.plateNo1[0],
      bus_2: k.plateNo2[0],
      check_time: time1,
      isstart: start,
    };
  };

  var parser = new xml2js.Parser();
  let time = new Date();

  // time =
  //   time.getFullYear() +
  //   "-" +
  //   ("0" + (time.getMonth() + 1)).slice(-2) +
  //   "-" +
  //   ("0" + time.getDate()).slice(-2) +
  //   " " +
  //   ("0" + time.getHours()).slice(-2) +
  //   ":" +
  //   ("0" + time.getMinutes()).slice(-2) +
  //   ":" +
  //   ("0" + time.getSeconds()).slice(-2);

  console.log(time);
  let finalArr = [];

  finalArr = await Promise.all(
    busStopArr.map(async (z, w) => {
      const xml = await axios.get(
        `${url}?serviceKey=${serviceKey}&stationId=${z.key}`
      );
      // parser.parseString(xml.data, function (err, result) {
      //   if (result?.response?.msgHeader)
      //     time = result.response.msgHeader[0]["queryTime"][0];
      // });
      // console.log(time);

      const result = await new Promise((resolve, reject) =>
        parser.parseString(xml.data, (err, result) => {
          if (err) reject(err);
          else {
            if (!result?.response?.msgBody) resolve(null);
            else {
              const rtn = result.response.msgBody[0]["busArrivalList"].map(
                (k, i) => {
                  return returnObj(k, time, z.start);
                }
              );
              resolve(rtn);
            }
          }
        })
      );
      return result;
    })
  );
  let newArr = [];
  finalArr.map((k, i) => {
    newArr = _.concat(newArr, k);
  });

  let data = convert.toSnakeObjArray(newArr);
  data = data.filter((element) => {
    if (Object.keys(element).length !== 0) {
      return true;
    }

    return false;
  });
  console.log(data);
  data.map((k, i) => {
    db["busArrival"].create(k);
  });

  const replacement1 = { checkTime: time };
  reqres.noResponseBody("dispatch_arrival(:checkTime)", replacement1, "INSERT");
  //db["busArrival"].bulkCreate({ data: data });

  const rtn1 = {
    status: 200,
    message: "success",
    object: newArr,
  };

  return res.status(200).send(rtn1);
};

const xmlParse = (xmldata, bodyComponent, returnObj, next) => {
  var extractedData = "";
  var parser = new xml2js.Parser();
  parser.parseString(xmldata, function (err, result) {
    //Extract the value from the data element
    extractedData = result.response.msgBody[0][bodyComponent].map((k, i) => {
      return returnObj(k);
    });

    //if (next) next(extractedData);
  });
  return extractedData;
};

module.exports.checkBusArrival = checkBusArrival;
module.exports.getBusLocation = getBusLocation;
module.exports.getBusLocationEdge = getBusLocationEdge;