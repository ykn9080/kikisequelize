const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const options = {
  info: {
    title: 'KIKIB API SERVER by node sequelizer',
    description: 'node sequelizer로 만든 api server입니다.',
  },
  servers: [
    {
      url: 'http://dualstack.kikiorm-lb-1900247784.ap-northeast-2.elb.amazonaws.com',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};
const outputFile = './swagger/swagger-output1.json';
const endpointsFiles = ['./app/routes/*.js'];
swaggerAutogen(outputFile, endpointsFiles, options);