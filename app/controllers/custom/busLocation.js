const db = require("../../models");

var xml2js = require("xml2js");
const _ = require("lodash");
const axios = require("axios");
const convert = require("../../middleware/CamelSnake");
const reqres = require("../requestResponse");
const moment = require("moment");

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
  const xml = await axios
    .get(`${url}?serviceKey=${serviceKey}&routeId=${routeRow.api_route_id}`)
    .catch(function (error) {
      console.log("error getBusLocation xml.get()");
    });
  if (!(xml && xml.data))
    return res.status(200).send({
      status: 400,
      message: "fail, no data available.",
    });
  const result = xmlParse(xml.data, "busLocationList", returnObj);
  // const edgeresult = reqres.noResponseBody(
  //   "dispatch_arrival(:checkTime)",
  //   replacement1,
  //   "INSERT"
  // );
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

const getBusLocationBatch = async (req, res) => {
  const serviceKey =
    "jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";
  const url = `http://apis.data.go.kr/6410000/buslocationservice/getBusLocationList`;

  const routeRow = await db["route"].findAll();
  const returnObj = (k, time1) => {
    return {
      station_id: parseInt(k.stationId[0]),
      station_seq: parseInt(k.stationSeq[0]),
      api_route_id: parseInt(k.routeId[0]),
      bus_number: k.plateNo[0],
      check_time: time1,
    };
  };

  var parser = new xml2js.Parser();
  //let time = new Date();
  let time = dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", false);
  //dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", false);

  let finalArr = [];
  console.log("getBusLocationBatch");
  // finalArr = await Promise.all(
  //   routeRow.map(async (z, w) => {
  //     const xml = await axios
  //       .get(`${url}?serviceKey=${serviceKey}&routeId=${z.api_route_id}`)
  //       .catch(function (error) {
  //         console.log("error getBusLocation xml.get()");
  //       });

  //     const result = await new Promise((resolve, reject) => {
  //       if (xml)
  //         parser.parseString(xml.data, (err, result) => {
  //           if (err) reject(err);
  //           else {
  //             if (result && result.response && result.response.msgBody) {
  //               try {
  //                 const rtn = result.response.msgBody[0]["busLocationList"].map(
  //                   (k, i) => {
  //                     return returnObj(k, time);
  //                   }
  //                 );
  //                 resolve(rtn);
  //               } catch (e) {
  //                 console.log("error happened!!!!");
  //                 resolve(null);
  //               }
  //             } else resolve(null);
  //           }
  //         });
  //     });
  //     return result;
  //   })
  // );
  // let newArr = [];
  // finalArr.map((k, i) => {
  //   newArr = _.concat(newArr, k);
  // });

  // let data = convert.toSnakeObjArray(newArr);
  // data = data.filter((element) => {
  //   if (Object.keys(element).length !== 0) {
  //     return true;
  //   }

  //   return false;
  // });

  // data.map((k, i) => {
  //   db["busArrivalStation"].create(k);
  // });

  // const rtn1 = {
  //   status: 200,
  //   message: "success",
  //   object: newArr,
  // };

  // return res.status(200).send(rtn1);
};

const getBusLocationEdge = async (req, res) => {
  let replacement = req.params;
  console.log(replacement);
  const routeId = req.params.routeId;
  const cdate = req.params.cdate;
  console.log(cdate);

  //const replacement1 = { routeId: routeId };
  const replacement1 = { routeId: routeId, cdate: cdate };
  let option = {
    replacements: replacement1,
    type: db.sequelize.QueryTypes["SELECT"],
    raw: true,
  };
  // var query =
  //   "select a.lon, a.lat,time,bus_name,speed,concat(lat,',',lon)latlng from edge_device a join bus b on a.bus_name=b.number " +
  //   "where route_id=:routeId and time>date_sub(now(), interval 1 minute)  and time<=now() order by time desc limit 1";
  const rtnn = await db.sequelize.query("CALL edge_by_time(:routeId)", option);
  //const rtnn = await db.sequelize.query(query, option);
  console.log(option, rtnn);
  const stations = await db["routeStation"].findAll({
    where: { route_id: routeId },
    raw: true,
  });

  let min = 1000,
    businfo;
  const rtn2 = rtnn[0]["0"];
  console.log(option, rtnn);
  await Promise.all(
    stations.map((k, i) => {
      const distance = distanceInKmBetweenEarthCoordinates(
        rtn2.lon,
        rtn2.lat,
        k.x,
        k.y
      );
      if (distance < min) {
        min = distance;
        k.busEdgeArrival = 1;
        k.busNumber = rtn2.bus_name;
        k.lng = rtn2.lon;
        k.lat = rtn2.lat;
        businfo = k;
      }
    })
  );
  const rtn1 = {
    status: 200,
    message: "success",
    object: businfo,
  };

  return res.status(200).send(rtn1);
};

const checkBusArrival = async (req, res) => {
  console.log("checkBusArrival");
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

  // const returnObj = (k, time1, start) => {
  //   return {
  //     api_route_id: parseInt(k.routeId[0]),
  //     remain_1: isNaN(parseInt(k.predictTime1[0]))
  //       ? null
  //       : parseInt(k.predictTime1[0]),
  //     remain_2: isNaN(parseInt(k.predictTime2[0]))
  //       ? null
  //       : parseInt(k.predictTime2[0]),

  //     stop_1: isNaN(parseInt(k.locationNo1[0]))
  //       ? null
  //       : parseInt(k.locationNo1[0]),
  //     stop_2: isNaN(parseInt(k.locationNo2[0]))
  //       ? null
  //       : parseInt(k.locationNo2[0]),
  //     bus_1: k.plateNo1[0],
  //     bus_2: k.plateNo2[0],
  //     check_time: time1,
  //     isstart: start,
  //   };
  // };

  // var parser = new xml2js.Parser();
  // let time = new Date();
  // //dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", false);

  // let finalArr = [];

  // finalArr = await Promise.all(
  //   busStopArr.map(async (z, w) => {
  //     const xml = await axios
  //       .get(`${url}?serviceKey=${serviceKey}&stationId=${z.key}`)
  //       .catch(function (error) {
  //         console.log("checkBusArrival error");
  //       });
  //     // parser.parseString(xml.data, function (err, result) {
  //     //   if (result?.response?.msgHeader)
  //     //     time = result.response.msgHeader[0]["queryTime"][0];
  //     // });
  //     // console.log(time);

  //     const result = await new Promise((resolve, reject) => {
  //       if (xml)
  //         parser.parseString(xml.data, (err, result) => {
  //           if (err) reject(err);
  //           else {
  //             if (result && result.response && result.response.msgBody) {
  //               try {
  //                 const rtn = result.response.msgBody[0]["busArrivalList"].map(
  //                   (k, i) => {
  //                     return returnObj(k, time, z.start);
  //                   }
  //                 );
  //                 resolve(rtn);
  //               } catch (e) {
  //                 console.log("error happened!!!!");
  //                 resolve(null);
  //               }
  //             } else resolve(null);
  //           }
  //         });
  //     });
  //     return result;
  //   })
  // );
  // let newArr = [];
  // finalArr.map((k, i) => {
  //   newArr = _.concat(newArr, k);
  // });

  // let data = convert.toSnakeObjArray(newArr);
  // data = data.filter((element) => {
  //   if (Object.keys(element).length !== 0) {
  //     return true;
  //   }

  //   return false;
  // });

  // data.map((k, i) => {
  //   db["busArrival"].create(k);
  // });

  // const replacement1 = { checkTime: time };
  // reqres.noResponseBody("dispatch_arrival(:checkTime)", replacement1, "INSERT");
  // //db["busArrival"].bulkCreate({ data: data });

  // const rtn1 = {
  //   status: 200,
  //   message: "success",
  //   object: newArr,
  // };

  // return res.status(200).send(rtn1);
};

const xmlParse = (xmldata, bodyComponent, returnObj, next) => {
  var extractedData = "";
  var parser = new xml2js.Parser();
  parser.parseString(xmldata, function (err, result) {
    //Extract the value from the data element
    if (result && result.response && result.response.msgBody)
      extractedData = result.response.msgBody[0][bodyComponent].map((k, i) => {
        return returnObj(k);
      });

    //if (next) next(extractedData);
  });
  return extractedData;
};

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  var lat11 = degreesToRadians(lat1);
  var lat22 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat11) * Math.cos(lat22);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

/**
 *
 * @param {*} currentPos 버스현재 위치
 * @param {*} stationPos 정류장 위치
 * @param {*} radius 반경 km :0.05(50m)
 */
function isInCircle(currentPos, stationPos, radius) {
  const distance = distanceInKmBetweenEarthCoordinates(
    currentPos.lat,
    currentPos.lng,
    stationPos.lat,
    stationPos.lng
  );

  const calculationResult = distance <= radius;
  console.log(
    "Is inside",
    stationPos,
    currentPos,
    distance,
    radius,
    calculationResult
  );
  return calculationResult;
}
function isInCircle1(currentPos, stationPos, radius) {
  const distance = distanceInKmBetweenEarthCoordinates(
    currentPos.lat,
    currentPos.lng,
    stationPos.lat,
    stationPos.lng
  );

  const calculationResult = distance <= radius;
  return {
    stationPos,
    currentPos,
    distance,
    radius,
    calculationResult,
  };
}

function dateFormat(date, fstr, utc) {
  utc = utc ? "getUTC" : "get";
  return fstr.replace(/%[YmdHMS]/g, function (m) {
    switch (m) {
      case "%Y":
        return date[utc + "FullYear"](); // no leading zeros required
      case "%m":
        m = 1 + date[utc + "Month"]();
        break;
      case "%d":
        m = date[utc + "Date"]();
        break;
      case "%H":
        m = date[utc + "Hours"]();
        break;
      case "%M":
        m = date[utc + "Minutes"]();
        break;
      case "%S":
        m = date[utc + "Seconds"]();
        break;
      default:
        return m.slice(1); // unknown code, remove %
    }
    // add leading zero if required
    return ("0" + m).slice(-2);
  });
}

/* dateFormat (new Date (), "%Y-%m-%d %H:%M:%S", true) returns 
   "2012-05-18 05:37:21"  */

module.exports.checkBusArrival = checkBusArrival;
module.exports.getBusLocation = getBusLocation;
module.exports.getBusLocationEdge = getBusLocationEdge;
module.exports.getBusLocationBatch = getBusLocationBatch;
