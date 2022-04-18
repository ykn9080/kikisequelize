require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const swaggerUi = require("swagger-ui-express");

const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
global.encdata;
var options = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  //customCssUrl: "/custom.css",
  swaggerOptions: {
    url: "http://petstore.swagger.io/v2/swagger.json",
    url: "/apidoc/swagger.yaml",
    docExpansion: "none",
  },
};
app.get("/apidoc/swagger.yaml", (req, res) =>
  res.end(JSON.stringify(swaggerDocument, null, 3))
);

app.use("/apidoc", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

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
db.sequelize.sync({ force: false, alter: true });
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
const cryp = require("./app/util/crypto");

app.get("/enc", (req, res) => {
  console.log(req.query);
  res.json({
    //decrypt: cryp.decrypt(),
    encrypt: cryp.encrypt(JSON.stringify(req.query)),
  });
});
app.get("/dec", (req, res) => {
  res.json({
    decrypt: JSON.parse(cryp.decrypt()),
  });
});
//require("./app/routes/turorial.routes")(app);
require("./app/routes")(app);
require("./app/routes/reuseCRUD")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
