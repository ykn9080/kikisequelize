const db = require("../../models");
var xml2js = require("xml2js");
const _ = require("lodash");
const axios = require("axios");
const convert = require("../../middleware/CamelSnake");

exports.getBusLocation = async (req, res) => {
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
    result.map((s, j) => {
      if (k.station_id === s.station_id) {
        k.bus_arrival = 1;
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
const xmlParse = (xmldata, bodyComponent, returnObj, next) => {
  var extractedData = "";
  var parser = new xml2js.Parser();
  parser.parseString(xmldata, function (err, result) {
    //Extract the value from the data element
    extractedData = result.response.msgBody[0][bodyComponent].map((k, i) => {
      return {
        station_id: parseInt(k.stationId[0]),
        station_seq: parseInt(k.stationSeq[0]),
        api_route_id: parseInt(k.routeId[0]),
        route_id: null,
      };
    });

    //if (next) next(extractedData);
  });
  return extractedData;
};
