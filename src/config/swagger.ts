import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FixItNow API",
      version: "1.0.0",
      description:
        "Backend REST API for FixItNow - On-Demand Home Services Marketplace platform.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in format: Bearer <token>",
        },
      },
      schemas: {
        StandardSuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },
        StandardErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message description",
            },
            errorDetails: {
              type: "string",
              example: "Detailed error diagnostic info",
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.ts", "./src/modules/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
