const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^routes/(.*)$": "<rootDir>/src/routes/$1",
    "^controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^config/(.*)$": "<rootDir>/src/config/$1",
  },
};
