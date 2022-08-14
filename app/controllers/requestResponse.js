const db = require("../models");
const _ = require("lodash");
const convert = require("../middleware/CamelSnake");
/**
 * 변수를 path로 보내는 형태
 * @param {*} req
 * @param {*} paramArray :파라미터를 array에 담아보냄["param1", "param2",...]
 * @returns
 */
const replacementPathReturn = (req, paramArray) => {
  if (!req.path) return null;
  let replacement = {};
  let pth = req.path.split("/"); // ex:/21/2022-06-01
  if (pth.length < paramArray.length) {
    return "path not complete";
  }
  paramArray.map((k, i) => {
    replacement[k] = pth[i + 1];
  });
  return replacement;
};
const noResponseBody = async (queryOrProc, replacement, querytype, next) => {
  const originQuery = queryOrProc;
  let option = {
    replacements: replacement,
    type: db.sequelize.QueryTypes[querytype],
  };
  if (!_.startsWith(queryOrProc.toLowerCase(), "select")) {
    queryOrProc = "CALL " + queryOrProc;
    option.plain = true;
  }
  try {
    db.sequelize.query(queryOrProc, option);

    next(originQuery, "success");
  } catch (e) {
    next(queryOrProc, "failed");
  }
  // .then((resp) => {
  //   console.log("success happened");
  //   next();
  // })
  // .catch((err) => {
  //   console.log("err happened");
  //   next();
  // });
};
const commonQueryBody = (queryOrProc, replacement, res, next) => {
  let option = {
    replacements: replacement,
    type: db.sequelize.QueryTypes.SELECT,
  };
  if (!_.startsWith(queryOrProc.toLowerCase(), "select")) {
    queryOrProc = "CALL " + queryOrProc;
    option.plain = true;
  }
  console.log("queryOrProc, option:", queryOrProc, option, typeof res);
  db.sequelize
    .query(queryOrProc, option)
    .then((resp) => {
      if (res) {
        if (!Array.isArray(resp)) resp = Object.values(resp);
        commonReturn(resp, res);
      }
      next();
    })
    .catch((err) => {
      if (res) return res.json(err.message);
      console.log("failed....");
      next();
    });
};

/**
 * 일반적인 리턴문
 * @param {*} resp
 * @param {*} res
 * @returns
 */
const commonReturn = (resp, res) => {
  let rtn = resp;
  if (!rtn) {
    const val = {
      response: "no data",
      result: false,
    };

    return res.status(400).send(val);
  }
  let array = Object.values(resp).map((k, i) => {
    return convert.toCamel(k);
  });

  const rtn1 = {
    status: 200,
    message: "success",
    object: array,
  };

  return res.status(200).send(rtn1);
};

module.exports.replacementPathReturn = replacementPathReturn;
module.exports.noResponseBody = noResponseBody;
module.exports.commonQueryBody = commonQueryBody;
module.exports.commonReturn = commonReturn;
