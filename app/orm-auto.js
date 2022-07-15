/**
 * node ./app/orm-auto.js 실행시
 * root dir에 model(현재 auto-model로 rename됨) 폴더 생성되고 model이 자동생성됨
 */

const SequelizeAuto = require('sequelize-auto');
const dbConfig = require("./config/db.config1.js");
console.log(dbConfig)


const auto = new SequelizeAuto(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    operatorsAliases: 0,
      //noAlias: true // as 별칭 미설정 여부
   }
);
auto.run((err)=>{
   if(err) throw err;
})