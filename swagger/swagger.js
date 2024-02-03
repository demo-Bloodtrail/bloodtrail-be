import SwaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BloodTrail API Docs",
      version: "1.0.0",
      description: "BloodTrail Server API 명세서",
    },
    host: "localhost:3000",
    basepath: "../",
  },
  apis: ["../router/*.js", "./swagger/*"],
};

export const specs = SwaggerJsdoc(options);
