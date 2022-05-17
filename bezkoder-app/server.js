require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
require("./swagger")(app);
// const swaggerUi = require("swagger-ui-express");

// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger/swagger.yaml");
// global.encdata;
// var options = {
//   explorer: true,
//   customCss: ".swagger-ui .topbar { display: none }",
//   //customCssUrl: "/custom.css",
//   swaggerOptions: {
//     url: "http://petstore.swagger.io/v2/swagger.json",
//     url: "/apidoc/swagger.yaml",
//     docExpansion: "none",
//   },
// };
// app.get("/apidoc/swagger.yaml", (req, res) =>
//   res.end(JSON.stringify(swaggerDocument, null, 3))
// );

// app.use("/apidoc", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

var corsOptions = {
  origin: "http://localhost:8484",
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
console.log("password", process.env.DB_PASSWORD);
//db.sequelize.sync({ force: false, alter: true });
db.sequelize.sync({ force: false, alter: true });
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
const crypto = require("./app/util/crypto");
app.get("/healthcheck", (req, res) => res.send("Hello World!"));
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
const PORT = process.env.LOCAL_PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
