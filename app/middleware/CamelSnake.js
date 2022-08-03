 
const _ = require("lodash");

exports.toCamel=(data) =>{return _.mapKeys(data, (value, key) => _.camelCase(key));}
exports.toSnake=(data) =>{return _.mapKeys(data, (value, key) => _.snakeCase(key));}
exports.makeReturn=(resp)=>{

    return _.mapKeys(resp, (value, key) => _.camelCase(key));

}


 
