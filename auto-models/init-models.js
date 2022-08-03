var DataTypes = require("sequelize").DataTypes;
// var _bus = require("../models/bus");
// var _business_place = require("../models/business_place");
// var _company = require("../models/company");
// var _company_group = require("../models/company_group");
// var _day_off = require("../models/day_off");
// var _delete_user = require("../models/delete_user");
// var _dispatch = require("../models/dispatch");
// var _driving_issue = require("../models/driving_issue");
// var _edge_device = require("../models/edge_device");
// var _hibernate_sequence = require("../models/hibernate_sequence");
// var _holidays = require("../models/holidays");
// var _lost = require("../models/lost");
// var _manage = require("../models/manage");
var _notice = require("./notice");
var _alert = require("./alert");
var _user_alert=require("./user_alert");
// var _notification = require("../models/notification");
// var _notification_box = require("../models/notification_box");
// var _replace_request = require("../models/replace_request");
// var _route = require("../models/route");
var _route_driver = require("../auto-models/route_driver");
var _route_driver1 = require("../auto-models/route_driver1");
// var _route_setting = require("../models/route_setting");
// var _schedule_request = require("../models/schedule_request");
// var _schedule_setting = require("../models/schedule_setting");
 var _stop_working = require("../auto-models/stop_working");
// var _tutorial = require("../models/tutorial");
// var _user = require("../models/user");
// var _user_notice = require("../models/user_notice");
// var _work = require("../models/work");
// var _work_check = require("../models/work_check");
// var _work_request = require("../models/work_request");


function initModels(sequelize) {
  // var bus = _bus(sequelize, DataTypes);
  // var business_place = _business_place(sequelize, DataTypes);
  // var company = _company(sequelize, DataTypes);
  // var company_group = _company_group(sequelize, DataTypes);
  // var day_off = _day_off(sequelize, DataTypes);
  // var delete_user = _delete_user(sequelize, DataTypes);
  // var dispatch = _dispatch(sequelize, DataTypes);
  // var driving_issue = _driving_issue(sequelize, DataTypes);
  // var edge_device = _edge_device(sequelize, DataTypes);
  // var hibernate_sequence = _hibernate_sequence(sequelize, DataTypes);
  // var holidays = _holidays(sequelize, DataTypes);
  // var lost = _lost(sequelize, DataTypes);
  // var manage = _manage(sequelize, DataTypes);
  var notice = _notice(sequelize, DataTypes);
  var alert = _alert(sequelize, DataTypes);
  var user_alert = _user_alert(sequelize, DataTypes);
  // var notification = _notification(sequelize, DataTypes);
  // var notification_box = _notification_box(sequelize, DataTypes);
  // var replace_request = _replace_request(sequelize, DataTypes);
  // var route = _route(sequelize, DataTypes);
  var route_driver = _route_driver(sequelize, DataTypes);
  var route_driver1 = _route_driver1(sequelize, DataTypes);
  // var route_setting = _route_setting(sequelize, DataTypes);
  // var schedule_request = _schedule_request(sequelize, DataTypes);
  // var schedule_setting = _schedule_setting(sequelize, DataTypes);
  var stopworking = _stop_working(sequelize, DataTypes);
  // var tutorial = _tutorial(sequelize, DataTypes);
  // var user = _user(sequelize, DataTypes);
  // var user_notice = _user_notice(sequelize, DataTypes);
  // var work = _work(sequelize, DataTypes);
  // var work_check = _work_check(sequelize, DataTypes);
  // var work_request = _work_request(sequelize, DataTypes);

  // dispatch.belongsTo(bus, { as: "bus", foreignKey: "bus_id"});
  // bus.hasMany(dispatch, { as: "dispatches", foreignKey: "bus_id"});
  // driving_issue.belongsTo(bus, { as: "bus", foreignKey: "bus_id"});
  // bus.hasMany(driving_issue, { as: "driving_issues", foreignKey: "bus_id"});
  // route_driver.belongsTo(bus, { as: "bus", foreignKey: "bus_id"});
  // bus.hasMany(route_driver, { as: "route_drivers", foreignKey: "bus_id"});
  // manage.belongsTo(business_place, { as: "business_place", foreignKey: "business_place_id"});
  // business_place.hasMany(manage, { as: "manages", foreignKey: "business_place_id"});
  // notice.belongsTo(business_place, { as: "place", foreignKey: "place_id"});
  // business_place.hasMany(notice, { as: "notices", foreignKey: "place_id"});
  // route.belongsTo(business_place, { as: "business_place", foreignKey: "business_place_id"});
  // business_place.hasMany(route, { as: "routes", foreignKey: "business_place_id"});
  // bus.belongsTo(company, { as: "company", foreignKey: "company_id"});
  // company.hasMany(bus, { as: "buses", foreignKey: "company_id"});
  // driving_issue.belongsTo(company, { as: "company", foreignKey: "company_id"});
  // company.hasMany(driving_issue, { as: "driving_issues", foreignKey: "company_id"});
  // notice.belongsTo(company, { as: "company", foreignKey: "company_id"});
  // company.hasMany(notice, { as: "notices", foreignKey: "company_id"});
  // route.belongsTo(company, { as: "company", foreignKey: "company_id"});
  // company.hasMany(route, { as: "routes", foreignKey: "company_id"});
  // user.belongsTo(company, { as: "company", foreignKey: "company_id"});
  // company.hasMany(user, { as: "users", foreignKey: "company_id"});
  // company.belongsTo(company_group, { as: "group", foreignKey: "group_id"});
  // company_group.hasMany(company, { as: "companies", foreignKey: "group_id"});
  // notice.belongsTo(company_group, { as: "group", foreignKey: "group_id"});
  // company_group.hasMany(notice, { as: "notices", foreignKey: "group_id"});
  // user_notice.belongsTo(notice, { as: "notice", foreignKey: "notice_id"});
  // notice.hasMany(user_notice, { as: "user_notices", foreignKey: "notice_id"});
  // bus.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(bus, { as: "buses", foreignKey: "route_id"});
  // manage.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(manage, { as: "manages", foreignKey: "route_id"});
  // notice.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(notice, { as: "notices", foreignKey: "route_id"});
  // replace_request.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(replace_request, { as: "replace_requests", foreignKey: "route_id"});
  // route_driver.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(route_driver, { as: "route_drivers", foreignKey: "route_id"});
  // route_setting.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(route_setting, { as: "route_settings", foreignKey: "route_id"});
  // schedule_request.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(schedule_request, { as: "schedule_requests", foreignKey: "route_id"});
  // schedule_setting.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(schedule_setting, { as: "schedule_settings", foreignKey: "route_id"});
  // work.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(work, { as: "works", foreignKey: "route_id"});
  // work_check.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(work_check, { as: "work_checks", foreignKey: "route_id"});
  // work_request.belongsTo(route, { as: "route", foreignKey: "route_id"});
  // route.hasMany(work_request, { as: "work_requests", foreignKey: "route_id"});
  // dispatch.belongsTo(schedule_request, { as: "request", foreignKey: "request_id"});
  // schedule_request.hasMany(dispatch, { as: "dispatches", foreignKey: "request_id"});
  // schedule_request.belongsTo(schedule_request, { as: "pre_request", foreignKey: "pre_request_id"});
  // schedule_request.hasMany(schedule_request, { as: "schedule_requests", foreignKey: "pre_request_id"});
  // bus.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(bus, { as: "buses", foreignKey: "manager_id"});
  // day_off.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(day_off, { as: "day_offs", foreignKey: "driver_id"});
  // dispatch.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(dispatch, { as: "dispatches", foreignKey: "driver_id"});
  // driving_issue.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(driving_issue, { as: "driving_issues", foreignKey: "driver_id"});
  // lost.belongsTo(user, { as: "picker", foreignKey: "picker_id"});
  // user.hasMany(lost, { as: "losts", foreignKey: "picker_id"});
  // manage.belongsTo(user, { as: "managerr", foreignKey: "manager_id"});
  // user.hasMany(manage, { as: "manages", foreignKey: "manager_id"});
  // manage.belongsTo(user, { as: "manager_user", foreignKey: "manager"});
  // user.hasMany(manage, { as: "manager_manages", foreignKey: "manager"});
  // notice.belongsTo(user, { as: "writer", foreignKey: "writer_id"});
  // user.hasMany(notice, { as: "notices", foreignKey: "writer_id"});
  // notification.belongsTo(user, { as: "user", foreignKey: "user_id"});
  // user.hasMany(notification, { as: "notifications", foreignKey: "user_id"});
  // replace_request.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(replace_request, { as: "replace_requests", foreignKey: "manager_id"});
  // route.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(route, { as: "routes", foreignKey: "manager_id"});
  // route_driver.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(route_driver, { as: "route_drivers", foreignKey: "driver_id"});
  // route_driver.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(route_driver, { as: "manager_route_drivers", foreignKey: "manager_id"});
  // route_setting.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(route_setting, { as: "route_settings", foreignKey: "manager_id"});
  // schedule_request.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(schedule_request, { as: "schedule_requests", foreignKey: "manager_id"});
  // schedule_setting.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(schedule_setting, { as: "schedule_settings", foreignKey: "manager_id"});
  // stop_working.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(stop_working, { as: "stop_workings", foreignKey: "driver_id"});
  // user.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(user, { as: "users", foreignKey: "manager_id"});
  // user_notice.belongsTo(user, { as: "user", foreignKey: "user_id"});
  // user.hasMany(user_notice, { as: "user_notices", foreignKey: "user_id"});
  // work.belongsTo(user, { as: "driver", foreignKey: "driver_id"});
  // user.hasMany(work, { as: "works", foreignKey: "driver_id"});
  // work.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(work, { as: "manager_works", foreignKey: "manager_id"});
  // work_check.belongsTo(user, { as: "manager", foreignKey: "manager_id"});
  // user.hasMany(work_check, { as: "work_checks", foreignKey: "manager_id"});
  // day_off.belongsTo(work, { as: "work", foreignKey: "work_id"});
  // work.hasMany(day_off, { as: "day_offs", foreignKey: "work_id"});
  // day_off.belongsTo(work, { as: "to_work_work", foreignKey: "to_work"});
  // work.hasMany(day_off, { as: "to_work_day_offs", foreignKey: "to_work"});
  // replace_request.belongsTo(work, { as: "req_driver_work", foreignKey: "req_driver_work_id"});
  // work.hasMany(replace_request, { as: "replace_requests", foreignKey: "req_driver_work_id"});
  // replace_request.belongsTo(work, { as: "req_driver_leave", foreignKey: "req_driver_leave_id"});
  // work.hasMany(replace_request, { as: "req_driver_leave_replace_requests", foreignKey: "req_driver_leave_id"});
  // replace_request.belongsTo(work, { as: "res_driver_leave", foreignKey: "res_driver_leave_id"});
  // work.hasMany(replace_request, { as: "res_driver_leave_replace_requests", foreignKey: "res_driver_leave_id"});
  // replace_request.belongsTo(work, { as: "res_driver_work", foreignKey: "res_driver_work_id"});
  // work.hasMany(replace_request, { as: "res_driver_work_replace_requests", foreignKey: "res_driver_work_id"});
  

  return {
    // bus,
    // business_place,
    // company,
    // company_group,
    // day_off,
    // delete_user,
    // dispatch,
    // driving_issue,
    // edge_device,
    // hibernate_sequence,
    // holidays,
    // lost,
    // manage,
      //notice,
      //alert,
      //user_alert,
    // notification,
    // notification_box,
    // replace_request,
    // route,
    //route_driver,
    route_driver1,
    // route_setting,
    // schedule_request,
    // schedule_setting,
      //stopworking,
    // tutorial,
    // user,
    // user_notice,
    // work,
    // work_check,
    // work_request,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
