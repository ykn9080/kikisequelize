const _ = require("lodash");

exports.toCamel = (data) => {
  return _.mapKeys(data, (value, key) => _.camelCase(key));
};

/**
 *
 * @param {*} data ={id:2, stopType:"good",createdAt:"2021-10-11"}
 * @returns {id:2, stop_type:"good",created_at:"2021-10-11"}
 */
exports.toSnake = (data) => {
  return _.mapKeys(data, (value, key) => _.snakeCase(key));
};

/**
 *
 * @param {*} data =[{id:2, stopType:"good"},{id:3, stopType:"bad"}]
 * @returns [{id:2, stop_type:"good"},{id:3, stop_type:"bad"}]
 */
exports.toSnakeObjArray = (data) => {
  return data.map((k, i) => {
    return _.mapKeys(k, (value, key) => _.snakeCase(key));
  });
};
/**
 *
 * @param {} data =["stopType","createdAt"]
 * @returns ["stop_type","created_at"]
 */
exports.toSnakeArray = (data) => {
  return data.map((k, i) => {
    return _.snakeCase(k);
  });
};
exports.toSnakeSingle = (data) => {
  return _.snakeCase(data);
};

exports.makeReturn = (resp) => {
  return _.mapKeys(resp, (value, key) => _.camelCase(key));
};
