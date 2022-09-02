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
  if (!xml.data)
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
  //   let time = new Date().toLocaleDateString("ko-KR", {
  //     timeZone: "Asia/Seoul",
  //     // year: "numeric",
  //     // hourCycle: "h23",
  //     // month: "2-digit",
  //     // day: "2-digit",
  //     // hour: "2-digit",
  //     // minute: "2-digit",
  //     // second: "2-digit",
  //   });
  // console.log(time)
  //   time = moment(time).format("YYYY-MM-DD hh:mm:ss");
  // console.log(time)
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

  ///console.log(time);
  let finalArr = [];

  finalArr = await Promise.all(
    busStopArr.map(async (z, w) => {
      const xml = await axios
        .get(`${url}?serviceKey=${serviceKey}&stationId=${z.key}`)
        .catch(function (error) {
          console.log("checkBusArrival error");
        });
      // parser.parseString(xml.data, function (err, result) {
      //   if (result?.response?.msgHeader)
      //     time = result.response.msgHeader[0]["queryTime"][0];
      // });
      // console.log(time);

      const result = await new Promise((resolve, reject) => {
        if (xml)
          parser.parseString(xml.data, (err, result) => {
            if (err) reject(err);
            else {
              if (result && result.response && result.response.msgBody) {
                try {
                  const rtn = result.response.msgBody[0]["busArrivalList"].map(
                    (k, i) => {
                      return returnObj(k, time, z.start);
                    }
                  );
                  resolve(rtn);
                } catch (e) {
                  console.log("error happened!!!!");
                  resolve(null);
                }
              } else resolve(null);
            }
          });
      });
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

var ss = {
  rtn: [
    {
      id: 249,
      lon: "126.9041083",
      lat: "37.4306683",
      time: "2022-08-31T06:25:05.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041083",
      lat: "37.4306683",
      time: "2022-08-31T06:25:09.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041117",
      lat: "37.4306783",
      time: "2022-08-31T06:25:13.000Z",
      bus_name: "경기71바1058",
      speed: 2.4624,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:17.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:21.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:25.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:28.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:31.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
    {
      id: 249,
      lon: "126.9041067",
      lat: "37.4306683",
      time: "2022-08-31T06:25:35.000Z",
      bus_name: "경기71바1058",
      speed: 0,
      number: "경기71바1058",
      status: "NORMAL",
      bus_type: "ELECTRIC",
      company_id: 1,
      route_id: 19,
      created_at: null,
      updated_at: null,
      manager_id: null,
      isrun: 1,
    },
  ],
  stations: [
    {
      id: 2156,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09214",
      regionName: "안양",
      stationId: 208000236,
      stationName: "차고지입구",
      x: 126.8935,
      y: 37.40905,
      stationSeq: 1,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2157,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09016",
      regionName: "안양",
      stationId: 208000110,
      stationName: "청란공원",
      x: 126.8947167,
      y: 37.4080833,
      stationSeq: 2,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2158,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09023",
      regionName: "안양",
      stationId: 208000109,
      stationName: "용강빌라",
      x: 126.8960333,
      y: 37.4071,
      stationSeq: 3,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2159,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09031",
      regionName: "안양",
      stationId: 208000108,
      stationName: "석수3동행정복지센터.코오롱하늘채아파트",
      x: 126.8988333,
      y: 37.4075667,
      stationSeq: 4,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2160,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09036",
      regionName: "안양",
      stationId: 208000107,
      stationName: "석수초등학교",
      x: 126.8999,
      y: 37.40725,
      stationSeq: 5,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2161,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09043",
      regionName: "안양",
      stationId: 208000106,
      stationName: "석수아이파크",
      x: 126.9020833,
      y: 37.4065833,
      stationSeq: 6,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2162,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09044",
      regionName: "안양",
      stationId: 208000208,
      stationName: "충훈1교",
      x: 126.9035833,
      y: 37.4057667,
      stationSeq: 7,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2163,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09069",
      regionName: "안양",
      stationId: 208000074,
      stationName: "럭키아파트",
      x: 126.90785,
      y: 37.4083167,
      stationSeq: 8,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2164,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09097",
      regionName: "안양",
      stationId: 208000073,
      stationName: "안양대교",
      x: 126.9112167,
      y: 37.4091833,
      stationSeq: 9,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2165,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09102",
      regionName: "안양",
      stationId: 208000072,
      stationName: "안양대교앞",
      x: 126.9118833,
      y: 37.4105833,
      stationSeq: 10,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2166,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09092",
      regionName: "안양",
      stationId: 208000071,
      stationName: "농협.KT석수시점",
      x: 126.9101,
      y: 37.4126833,
      stationSeq: 11,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2167,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09068",
      regionName: "안양",
      stationId: 208000070,
      stationName: "석수현대아파트",
      x: 126.9074833,
      y: 37.4158667,
      stationSeq: 12,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2168,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09064",
      regionName: "안양",
      stationId: 208000118,
      stationName: "관악역",
      x: 126.9070667,
      y: 37.4181167,
      stationSeq: 13,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2169,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09060",
      regionName: "안양",
      stationId: 208000117,
      stationName: "원태우지사의거지.석수체육공원.자동차학원",
      x: 126.9066167,
      y: 37.42215,
      stationSeq: 14,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2170,
      iscenter: 1,
      district_cd: 2,
      mobile_no: " 09056",
      region_name: "안양",
      station_id: 208000116,
      station_name: "대림.LG.힐스테이트아파트(중)",
      x: 126.9043833,
      y: 37.4297,
      station_seq: 15,
      isturn: 0,
      route_id: 19,
      bus_edge_arrival: 0,
      bus_number: null,
      busEdgeArrival: 1,
      busNumber: "경기71바1058",
    },
    {
      id: 2171,
      iscenter: 1,
      districtCd: 2,
      mobileNo: " 09040",
      regionName: "안양",
      stationId: 208000037,
      stationName: "석수역(중)",
      x: 126.90335,
      y: 37.4335833,
      stationSeq: 16,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2172,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000013,
      stationName: "시흥유통센터(중)",
      x: 126.9033667,
      y: 37.44015,
      stationSeq: 17,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2173,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000011,
      stationName: "박미삼거리.국립전통예술중고(중)",
      x: 126.9031667,
      y: 37.448,
      stationSeq: 18,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2174,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000009,
      stationName: "시흥사거리(중)",
      x: 126.9014667,
      y: 37.4524167,
      stationSeq: 19,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2175,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000007,
      stationName: "금천구청.금천경찰서(중)",
      x: 126.8988667,
      y: 37.4592,
      stationSeq: 20,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2176,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000005,
      stationName: "말미고개.금천소방서(중)",
      x: 126.8975,
      y: 37.464,
      stationSeq: 21,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2177,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000003,
      stationName: "금천우체국(중)",
      x: 126.8979833,
      y: 37.46905,
      stationSeq: 22,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2178,
      iscenter: 0,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000061,
      stationName: "독산고개",
      x: 126.89895,
      y: 37.4763667,
      stationSeq: 23,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2179,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 86044",
      regionName: "서울",
      stationId: 117000111,
      stationName: "모두의학교.금천문화예술정보학교",
      x: 126.9056167,
      y: 37.4799667,
      stationSeq: 24,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2180,
      iscenter: 0,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 117000112,
      stationName: "관악구보훈회관.신림푸르지오",
      x: 126.9091833,
      y: 37.4806333,
      stationSeq: 25,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2181,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89007",
      regionName: "서울",
      stationId: 120000016,
      stationName: "난곡입구",
      x: 126.9155667,
      y: 37.4818333,
      stationSeq: 26,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2182,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89123",
      regionName: "서울",
      stationId: 120000445,
      stationName: "호림박물관",
      x: 126.9186333,
      y: 37.4824167,
      stationSeq: 27,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2183,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89009",
      regionName: "서울",
      stationId: 120000017,
      stationName: "남서울중학교.성보중고등학교",
      x: 126.9208333,
      y: 37.4827833,
      stationSeq: 28,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2184,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89012",
      regionName: "서울",
      stationId: 120000018,
      stationName: "신림사거리.신림역",
      x: 126.9280833,
      y: 37.4838667,
      stationSeq: 29,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2185,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89029",
      regionName: "서울",
      stationId: 120000160,
      stationName: "관악우체국.양지병원",
      x: 126.9331667,
      y: 37.4844667,
      stationSeq: 30,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2186,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89013",
      regionName: "서울",
      stationId: 120000019,
      stationName: "KT&G관악지점",
      x: 126.93615,
      y: 37.4845333,
      stationSeq: 31,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2187,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89016",
      regionName: "서울",
      stationId: 120000020,
      stationName: "봉천역.관악초등학교",
      x: 126.94325,
      y: 37.48205,
      stationSeq: 32,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2188,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89018",
      regionName: "서울",
      stationId: 120000021,
      stationName: "KT관악지점",
      x: 126.9484667,
      y: 37.4815167,
      stationSeq: 33,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2189,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89020",
      regionName: "서울",
      stationId: 120000022,
      stationName: "봉천사거리",
      x: 126.9546,
      y: 37.48035,
      stationSeq: 34,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2190,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89022",
      regionName: "서울",
      stationId: 120000023,
      stationName: "낙성대동",
      x: 126.95755,
      y: 37.4791833,
      stationSeq: 35,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2191,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89023",
      regionName: "서울",
      stationId: 120000024,
      stationName: "낙성대입구",
      x: 126.9609,
      y: 37.4778833,
      stationSeq: 36,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2192,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89026",
      regionName: "서울",
      stationId: 120000025,
      stationName: "인헌중고.서울미술고",
      x: 126.9666,
      y: 37.47565,
      stationSeq: 37,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2193,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89031",
      regionName: "서울",
      stationId: 120000026,
      stationName: "예술인마을.사당초등학교",
      x: 126.9740333,
      y: 37.4759667,
      stationSeq: 38,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2194,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89032",
      regionName: "서울",
      stationId: 120000027,
      stationName: "남서울농협남현동지점",
      x: 126.9774167,
      y: 37.4764167,
      stationSeq: 39,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2195,
      iscenter: 0,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 120000059,
      stationName: "사당역4번출구",
      x: 126.9814,
      y: 37.47535,
      stationSeq: 40,
      isturn: 1,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2196,
      iscenter: 1,
      districtCd: 2,
      mobileNo: null,
      regionName: "서울",
      stationId: 120000672,
      stationName: "사당자동차학원(중)",
      x: 126.9831167,
      y: 37.4716,
      stationSeq: 41,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2197,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 89034",
      regionName: "서울",
      stationId: 120000061,
      stationName: "남태령역",
      x: 126.9878833,
      y: 37.4655833,
      stationSeq: 42,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2198,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21005",
      regionName: "과천",
      stationId: 220000002,
      stationName: "남태령부대",
      x: 126.98875,
      y: 37.4575,
      stationSeq: 43,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2199,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21014",
      regionName: "과천",
      stationId: 220000009,
      stationName: "관문사거리부대앞",
      x: 126.9940833,
      y: 37.4486333,
      stationSeq: 44,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2200,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21016",
      regionName: "과천",
      stationId: 220000008,
      stationName: "과천성당",
      x: 126.9943167,
      y: 37.4387667,
      stationSeq: 45,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2201,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21019",
      regionName: "과천",
      stationId: 220000007,
      stationName: "10단지",
      x: 126.9965333,
      y: 37.4353,
      stationSeq: 46,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2202,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21018",
      regionName: "과천",
      stationId: 220000006,
      stationName: "경기과천교육도서관",
      x: 126.9943667,
      y: 37.4316167,
      stationSeq: 47,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2203,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21011",
      regionName: "과천",
      stationId: 220000005,
      stationName: "KT과천지사",
      x: 126.99175,
      y: 37.4286833,
      stationSeq: 48,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2204,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21010",
      regionName: "과천",
      stationId: 220000004,
      stationName: "정부과천청사",
      x: 126.9899,
      y: 37.4266,
      stationSeq: 49,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2205,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21006",
      regionName: "과천",
      stationId: 220000003,
      stationName: "과천주공2.3단지",
      x: 126.9887167,
      y: 37.42175,
      stationSeq: 50,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2206,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21003",
      regionName: "과천",
      stationId: 220000030,
      stationName: "찬우물",
      x: 126.98395,
      y: 37.4154833,
      stationSeq: 51,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2207,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21001",
      regionName: "과천",
      stationId: 220000029,
      stationName: "갈현동부대",
      x: 126.9815667,
      y: 37.4133167,
      stationSeq: 52,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2208,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 21072",
      regionName: "과천",
      stationId: 220000082,
      stationName: "린파밀리에",
      x: 126.97895,
      y: 37.4071,
      stationSeq: 53,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2209,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10173",
      regionName: "안양",
      stationId: 209000116,
      stationName: "인덕원역4호선",
      x: 126.9756167,
      y: 37.4031333,
      stationSeq: 54,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2210,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10233",
      regionName: "안양",
      stationId: 209000259,
      stationName: "동편마을입구",
      x: 126.9718333,
      y: 37.4051167,
      stationSeq: 55,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2211,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10154",
      regionName: "안양",
      stationId: 209000115,
      stationName: "부림마을",
      x: 126.9693833,
      y: 37.40505,
      stationSeq: 56,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2212,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10140",
      regionName: "안양",
      stationId: 209000052,
      stationName: "중촌마을.동안치매안심센터",
      x: 126.9654667,
      y: 37.4048,
      stationSeq: 57,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2213,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10112",
      regionName: "안양",
      stationId: 209000051,
      stationName: "관양중학교",
      x: 126.9611833,
      y: 37.4040667,
      stationSeq: 58,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2214,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10076",
      regionName: "안양",
      stationId: 209000050,
      stationName: "수촌마을",
      x: 126.9554167,
      y: 37.4030167,
      stationSeq: 59,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2215,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10059",
      regionName: "안양",
      stationId: 209000049,
      stationName: "종합운동장",
      x: 126.9513667,
      y: 37.4022833,
      stationSeq: 60,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2216,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10034",
      regionName: "안양",
      stationId: 209000048,
      stationName: "삼호아파트",
      x: 126.9475667,
      y: 37.4008833,
      stationSeq: 61,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2217,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10017",
      regionName: "안양",
      stationId: 209000047,
      stationName: "동양월드타워",
      x: 126.9443333,
      y: 37.3990833,
      stationSeq: 62,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2218,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10216",
      regionName: "안양",
      stationId: 209000229,
      stationName: "대림아파트",
      x: 126.9426667,
      y: 37.3990167,
      stationSeq: 63,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2219,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10007",
      regionName: "안양",
      stationId: 209000046,
      stationName: "삼성래미안아파트",
      x: 126.9384333,
      y: 37.39905,
      stationSeq: 64,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2220,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 10004",
      regionName: "안양",
      stationId: 209000045,
      stationName: "비산사거리.이마트",
      x: 126.9358,
      y: 37.399,
      stationSeq: 65,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2221,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09177",
      regionName: "안양",
      stationId: 208000115,
      stationName: "진흥아파트.비산대교",
      x: 126.9306167,
      y: 37.3971333,
      stationSeq: 66,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2222,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09162",
      regionName: "안양",
      stationId: 208000114,
      stationName: "우체국사거리.안양초교.중화한방병원",
      x: 126.9261833,
      y: 37.3947833,
      stationSeq: 67,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2223,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09153",
      regionName: "안양",
      stationId: 208000066,
      stationName: "남부시장",
      x: 126.9238667,
      y: 37.39615,
      stationSeq: 68,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2224,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09146",
      regionName: "안양",
      stationId: 208000065,
      stationName: "안양1번가.안양고용센터",
      x: 126.9214667,
      y: 37.399,
      stationSeq: 69,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2225,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09139",
      regionName: "안양",
      stationId: 208000064,
      stationName: "대동문고",
      x: 126.9195,
      y: 37.4013833,
      stationSeq: 70,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2226,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09131",
      regionName: "안양",
      stationId: 208000105,
      stationName: "안양여중고",
      x: 126.91735,
      y: 37.40395,
      stationSeq: 71,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2227,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09123",
      regionName: "안양",
      stationId: 208000104,
      stationName: "만안초교",
      x: 126.915,
      y: 37.4067833,
      stationSeq: 72,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2228,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09096",
      regionName: "안양",
      stationId: 208000103,
      stationName: "안양대교",
      x: 126.9111167,
      y: 37.40935,
      stationSeq: 73,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2229,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09070",
      regionName: "안양",
      stationId: 208000102,
      stationName: "럭키아파트",
      x: 126.9078,
      y: 37.4085,
      stationSeq: 74,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2230,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09039",
      regionName: "안양",
      stationId: 208000209,
      stationName: "충훈1교",
      x: 126.90335,
      y: 37.4058333,
      stationSeq: 75,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2231,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09049",
      regionName: "안양",
      stationId: 208000101,
      stationName: "석수아이파크",
      x: 126.9021167,
      y: 37.4067667,
      stationSeq: 76,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2232,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09037",
      regionName: "안양",
      stationId: 208000100,
      stationName: "석수초등학교",
      x: 126.9000167,
      y: 37.4074,
      stationSeq: 77,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2233,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09032",
      regionName: "안양",
      stationId: 208000099,
      stationName: "석수3동행정복지센터.코오롱하늘채아파트",
      x: 126.8986,
      y: 37.4077333,
      stationSeq: 78,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2234,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09027",
      regionName: "안양",
      stationId: 208000098,
      stationName: "용강빌라",
      x: 126.8964333,
      y: 37.4073,
      stationSeq: 79,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2235,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09019",
      regionName: "안양",
      stationId: 208000097,
      stationName: "청란공원",
      x: 126.8951,
      y: 37.4079167,
      stationSeq: 80,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
    {
      id: 2236,
      iscenter: 0,
      districtCd: 2,
      mobileNo: " 09014",
      regionName: "안양",
      stationId: 208000096,
      stationName: "충훈부종점",
      x: 126.8937833,
      y: 37.4090667,
      stationSeq: 81,
      isturn: 0,
      routeId: 19,
      busEdgeArrival: 0,
      busNumber: null,
    },
  ],
};
const getBusLocationEdgeTest = (req, res) => {
  let arr = [],
    arr2 = [];
  ss.stations.map((k, i) => {
    k["bus_edge_arrival"] = 0;
    k["bus_number"] = null;
    ss.stations.splice(i, 1, k);
    ss.rtn.map((s, j) => {
      if (isInCircle({ lng: s.lon, lat: s.lat }, { lng: k.x, lat: k.y }, 0.2)) {
        k.busEdgeArrival = 1;
        k.busNumber = s.bus_name;
        k.buslng = s.lon;
        k.buslat = s.lat;
        ss.stations.splice(i, 1, k);
        arr.push(
          isInCircle1({ lng: s.lon, lat: s.lat }, { lng: k.x, lat: k.y }, 0.2)
        );
        arr2.push(k);
      }
    });
  });
  res.send({ station: arr2, arr });
};

module.exports.checkBusArrival = checkBusArrival;
module.exports.getBusLocation = getBusLocation;
module.exports.getBusLocationEdge = getBusLocationEdge;

module.exports.getBusLocationEdgeTest = getBusLocationEdgeTest;
