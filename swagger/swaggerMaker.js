var fs = require("fs");
var _ = require("lodash");
const path = "./swagger-maker-output.json";
const swaggerMaker = (req, res) => {
  const bd = req.body;
  const security = [
    {
      bearerAuth: [],
    },
  ];

  let rtn = {
    [`/api/${bd.name}`]: {
      post: {
        description: "",
        tags: [bd.name],
        responses: {
          200: {
            description: "OK",
          },
          400: {
            description: "Bad Request",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden",
          },
          500: {
            description: "Internal Server Error",
          },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  //           driverId: {
                  //             example: "371",
                  //           },
                  //           routeId: {
                  //             example: "19",
                  //           },
                  //           date: {
                  //             example: "2022-04-01",
                  //           },
                },
              },
              examples: {
                examTitle1: {
                  value: {},
                },
                examTitle2: {
                  value: {},
                },
              },
            },
          },
        },
      },

      get: {
        description: "",
        tags: [bd.name],
        parameters: [
          //   {
          //     "name": "busId",
          //     "in": "query",
          //     "required": false,
          //     "schema": {
          //       "type": "string"
          //     },
          //     "example":"$not null"
          //   },
          //   {
          //     "name": "driverId",
          //     "in": "query",
          //     "required": false,
          //     "schema": {
          //       "type": "string"
          //     },
          //     "example":"$not null"
          //   }
        ],
        responses: {
          200: {
            description: "OK",
          },
          400: {
            description: "Bad Request",
          },
        },
      },
    },
    [`/api/${bd.name}/{id}`]: {
      get: {
        description: "",
        tags: [bd.name],
        parameters: [],
        responses: {
          200: {
            description: "OK",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      put: {
        description: "",
        tags: [bd.name],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  //           date: {
                  //             example: "2022-04-01",
                  //           },
                },
              },
              examples: {
                examTitle1: {
                  value: {},
                },
                examTitle2: {
                  value: {},
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      delete: {
        description: "",
        tags: [bd.name],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {},
      },
    },
  };

  if (bd.security) {
    rtn[`/api/${bd.name}`].post.security = security;
    rtn[`/api/${bd.name}`].get.security = security;
    rtn[`/api/${bd.name}/{id}`].put.security = security;
    rtn[`/api/${bd.name}/{id}`].get.security = security;
    rtn[`/api/${bd.name}/{id}`].delete.security = security;
  }
  if (bd.attributes) {
    bd.attributes.map((k, i) => {
      let schemaAll =
        rtn[`/api/${bd.name}`].post.requestBody.content["application/json"];
      let schemaId =
        rtn[`/api/${bd.name}/{id}`].put.requestBody.content["application/json"];
      // rtn[`/api/${bd.name}`].post.requestBody.content[
      //   "application/json"
      // ].schema.properties[k] = bd.multiexample
      //   ? { type: "string" }
      //   : { example: "" };
      schemaAll.schema.properties[k] = bd.multiexample
        ? { type: "string" }
        : { example: "" };
      if (bd.multiexample) {
        schemaAll.examples.examTitle1.value[k] = "";
        schemaAll.examples.examTitle2.value[k] = "";
        schemaId.examples.examTitle1.value[k] = "";
        schemaId.examples.examTitle2.value[k] = "";
      } else {
        delete schemaAll.examples;
        delete schemaId.examples;
      }
      rtn[`/api/${bd.name}`].get.parameters.push({
        name: k,
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
        example: "",
      });
      rtn[`/api/${bd.name}/{id}`].get.parameters.push({
        name: k,
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
        example: "",
      });
      // rtn[`/api/${bd.name}/{id}`].put.requestBody.content[
      //   "application/json"
      // ].schema.properties[k] = bd.multiexample
      //   ? { type: "string" }
      //   : { example: "" };
      schemaId.schema.properties[k] = bd.multiexample
        ? { type: "string" }
        : { example: "" };
    });
  }
  const excludes = _.difference(
    ["get", "getAll", "post", "put", "delete"],
    bd.include
  );

  excludes.map((k, i) => {
    switch (k) {
      case "get":
        delete rtn[`/api/${bd.name}/{id}`].get;
        break;
      case "getAll":
        delete rtn[`/api/${bd.name}`].get;
        break;
      case "post":
        delete rtn[`/api/${bd.name}`].post;
        break;
      case "put":
        delete rtn[`/api/${bd.name}/{id}`].put;
        break;
      case "delete":
        delete rtn[`/api/${bd.name}/{id}`].delete;
        break;
    }
  });
  if (Object.keys(rtn[`/api/${bd.name}/{id}`]).length === 0)
    delete rtn[`/api/${bd.name}/{id}`];
  if (Object.keys(rtn[`/api/${bd.name}`]).length === 0)
    delete rtn[`/api/${bd.name}`];
  res.send(rtn);
};
module.exports.swaggerMaker = swaggerMaker;
