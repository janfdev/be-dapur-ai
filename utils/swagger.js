const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dapur AI API",
      version: "1.0.0",
      description:
        "API Documentation for Dapur AI - Recipe Generator Application",
    },
    servers: [
      {
        url: "https://be-dapur-ai.vercel.app/api",
        description: "Production Server",
      },
      // You can add your Vercel URL later here
      // {
      //   url: 'https://your-production-url.vercel.app/api',
      //   description: 'Production Server',
      // },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  // Look for annotations in routes folder
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
