const swaggerUi = require("swagger-ui-express");

const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/swagger.yaml");

module.exports = (app) => {
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

  app.use(
    "/apidoc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );
};
