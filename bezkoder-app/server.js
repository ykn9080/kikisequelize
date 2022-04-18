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
//const cryp = require("./app/util/crypto_old");

var crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.key; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
function encrypt(text) {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(text) {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
app.get("/enc", (req, res) => {
  console.log(req.query);
  res.json({
    //decrypt: cryp.decrypt(),
    encrypt: encrypt(JSON.stringify(req.query)),
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
