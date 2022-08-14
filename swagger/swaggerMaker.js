var fs = require("fs");
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
      rtn[`/api/${bd.name}`].post.requestBody.content[
        "application/json"
      ].schema.properties[k] = { example: "" };
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
      rtn[`/api/${bd.name}/{id}`].put.requestBody.content[
        "application/json"
      ].schema.properties[k] = { example: "" };
    });
  }
  res.send(rtn);
};
module.exports.swaggerMaker = swaggerMaker;
