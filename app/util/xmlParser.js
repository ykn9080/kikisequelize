var xml2js = require("xml2js");
var axios = require("axios");
const db = require("../models");

var routeId = 208000001;

// const publicToMysql1 = (routeId, realRouteId) => {
//   axios
//     .get(`${businfourl}?serviceKey=${serviceKey}&routeId=${routeId}`)
//     .then((xml) => {
//       var extractedData = "";
//       var parser = new xml2js.Parser();
//       console.log(xml.data);
//       parser.parseString(xml.data, function (err, result) {
//         //Extract the value from the data element
//         extractedData = result.response.msgBody[0].busRouteStationList.map(
//           (k, i) => {
//             return {
//               iscenter: k.centerYn[0] === "N" ? 0 : 1,
//               district_cd: parseInt(k.districtCd[0]),
//               mobile_no: k.mobileNo ? k.mobileNo[0] : null,
//               region_name: k.regionName[0],
//               station_id: parseInt(k.stationId[0]),
//               station_name: k.stationName[0],
//               x: parseFloat(k.x[0]),
//               y: parseFloat(k.y[0]),
//               station_seq: parseInt(k.stationSeq[0]),
//               isturn: k.turnYn[0] === "N" ? 0 : 1,
//               route_id: realRouteId,
//             };
//           }
//         );
//         console.log(extractedData);
//         axios
//           .post("http://localhost:8484/api/routeStation", {
//             data: extractedData,
//           })
//           .then(function (response) {
//             console.log(response);
//           });
//       });
//     });
// };

/**
 * 공공데이터 정류장정보를 route_station db에 넣는 기능
 */
var query = "select * from route";
var option = { type: db.sequelize.QueryTypes.SELECT };
db.sequelize.query(query, option).then((resp) => {
  var url =
    "http://apis.data.go.kr/6410000/busrouteservice/getBusRouteStationList";
  var serviceKey =
    "jmMJDKdbuZ8hYoXuyXlCKHYlNp02SQOlUaXXtTfryLsNQmC8HjxAnAe1NFofJ91BANDONhet17UQuHzY3DHJcw%3D%3D";

  resp.map((q, r) => {
    routeId = q.api_route_id;
    var realRouteId = q.id;

    publicFetch(url, serviceKey, routeId, realRouteId);
  });
});

/**
 *
 * @param {*} url 공공data url
 * @param {*} serviceKey 공공data 사용키
 * @param {*} routeId 버스노선ID
 * @param {*} realRouteId  버스노선DB 실제ID
 */
const publicFetch = async (url, serviceKey, routeId, realRouteId) => {
  const xml = await axios.get(
    `${url}?serviceKey=${serviceKey}&routeId=${routeId}`
  );
  xmlParse(xml.data, "busRouteStationList", realRouteId, returnObj, next);
};

/**
 *
 * @param {*} xmldata : fetch한 xml포맷 데이터
 * @param {*} bodyComponent: 파싱할 데이터 부분
 * @param {*} returnObj: 리턴할 데이터의 파싱된 결과물
 * @param {*} next: 후속작업이 필요할 경우지정
 */
const xmlParse = (xmldata, bodyComponent, realRouteId, returnObj, next) => {
  var extractedData = "";
  var parser = new xml2js.Parser();
  parser.parseString(xmldata, function (err, result) {
    //Extract the value from the data element
    extractedData = result.response.msgBody[0][bodyComponent].map((k, i) => {
      console.log(k);
      return returnObj(k, realRouteId);
    });
    if (next) next(extractedData);
  });
};

/**
 * xml문서를 파싱하여 리턴할 형태
 * @param {*} k
 * @returns
 */
const returnObj = (k, realRouteId) => {
  return {
    iscenter: k.centerYn[0] === "N" ? 0 : 1,
    district_cd: parseInt(k.districtCd[0]),
    mobile_no: k.mobileNo ? k.mobileNo[0] : null,
    region_name: k.regionName[0],
    station_id: parseInt(k.stationId[0]),
    station_name: k.stationName[0],
    x: parseFloat(k.x[0]),
    y: parseFloat(k.y[0]),
    station_seq: parseInt(k.stationSeq[0]),
    isturn: k.turnYn[0] === "N" ? 0 : 1,
    route_id: realRouteId,
  };
};
//
/**
 * 파싱이후 후속 작업이 있을 경우
 * 아래의 경우는 mysql에 bulk insert함
 * @param {*} extractedData
 */
const next = (extractedData) => {
  axios
    .post("http://localhost:8484/api/routeStation", {
      data: extractedData,
    })
    .then(function (response) {
      console.log(response);
    });
};

module.exports.xmlParse = xmlParse;
