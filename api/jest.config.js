module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  testTimeout: 30000,
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: false,
        tsconfig: {
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: ["*.ts", "!jest.config.js", "!coverage/**"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
