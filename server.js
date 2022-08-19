require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./app/util/cron"); //cron job설정
//require("./app/util/xmlParser");
const app = express();
//require("./swagger")(app);
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger-output.json");
const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzOTU4IiwiaXNzIjoia2lraUIiLCJpYXQiOjE2NTgwMjg4MDQsImV4cCI6MTY1ODYzMzYwNH0.aS5mMgD6vvm0WgBSkBKSLt7fvkkqolWkwq5m01GbJY3IiBx6BiVL7hB56ecO8O8lAJe8ZO7O2y8aECmCWA-gFA";
const swaggerUiOptions = {
  swaggerOptions: {
    authAction: {
      bearerAuth: {
        name: "JWT",
        schema: {
          type: "http",
          in: "header",
          name: "Authorization",
        },
        value: `${token}`,
      },
    },
  },
  persistAuthorization: true,
};

app.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);

// const swaggerUi = require("swagger-ui-express");

// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger/swagger.yaml");
// global.encdata;
// var options = {
//   //explorer: true,
//   //customCss: ".swagger-ui .topbar { display: none }",
//   //customCssUrl: "/custom.css",
//   swaggerOptions: {
//     url: "http://petstore.swagger.io/v2/swagger.json",
//     url: "/doc/swagger-output.json",
//     docExpansion: "none",
//   },
// };
// app.get("/doc/swagger-output.json", (req, res) =>
//   res.end(JSON.stringify(swaggerDocument, null, 3))
// );

// app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync({ force: false, alter: false });
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
const crypto = require("./app/util/crypto");
app.get("/healthcheck", (req, res) => res.send("Hello World!"));
app.get("/", (req, res) => res.send("Hello World root!"));
app.post("/enc", (req, res) => {
  console.log(req.body);
  res.json({
    //decrypt: cryp.decrypt(),
    request: crypto.encrypt(JSON.stringify(req.body)),
  });
});
app.post("/dec", (req, res) => {
  console.log(req.body);
  res.json({
    request: JSON.parse(crypto.decrypt(req.body.request)),
  });
});
//require("./app/routes/turorial.routes")(app);
require("./app/routes")(app);
require("./app/routes/reuseCRUD")(app);

// set port, listen for requests
const PORT = process.env.LOCAL_PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
