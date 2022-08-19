const reqres = require("./requestResponse");
/**
{
    "query":
    "SELECT a.* FROM tb_patient a LEFT JOIN tb_service b ON a.patient_id = b.patient_id WHERE b.service_id=:service_id",
    "replacements":{"service_id":3}
}
 */
exports.getQuery = (req, res) => {
  reqres.commonQueryBody(req.body.query, req.body.replacements, res);
};
exports.getRestbyDriverAndYearmonth = (req, res) => {
  var query =
    "SELECT * FROM rest" +
    " WHERE driver_id=:driverId and DATE_FORMAT(date,'%Y-%m')= :yearMonth";
  const replacement = req.params;
  replacement.driverId = req.id;
  reqres.commonQueryBody(query, replacement, res);
};
exports.getRestbyManagerAndYearmonth = (req, res) => {
  let replacement = req.params;
  replacement.managerId = req.id;
  var query =
    "select a.*,c.business_place_id branch_id,e.name route_name, d.name driver_name from rest a " +
    "join route_driver b on a.driver_id=b.driver_id and a.route_id=b.route_id " +
    "join route e on a.route_id=e.id " +
    "join manage c on c.route_id=a.route_id join user d on a.driver_id=d.id " +
    "where c.manager_id=:managerId and  DATE_FORMAT(a.date,'%Y-%m')=:yearMonth";
  if (replacement.routeId != -1)
    query += " and a.route_id=" + replacement.routeId;
  reqres.commonQueryBody(query, replacement, res);
};
/**
 * work get 대신실행됨(modifyData에서 intercept)
 * @param {*} req
 * @param {*} res
 */
exports.getWorkAddShift = (req, res) => {
  var query =
    "select a.*,b.shift from work a " +
    "join route_driver b on a.driver_id=b.driver_id and a.route_id=b.route_id " +
    "where status like 'work%' and a.route_id=:routeId and a.date=:date";
  reqres.commonQueryBody(query, req.query, res);
};
exports.cronJobSetting = (req, res, next) => {
  var query = "select * from cron_timer where isactive=1";
  reqres.commonQueryBody(query, null, res);
};

// exports.fixedupdate = (req, res) => {
//   req.dt.map((k, i) => {
//     db.route_driver.update(
//       { fixed_start_order: k.fixed_start_order, created_at: k.created_at },
//       {
//         where: { id: k.id },
//       }
//     );
//   });
//   res.send(req.dt);
// };
