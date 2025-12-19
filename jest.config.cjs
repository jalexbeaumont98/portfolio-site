// jest.config.cjs
module.exports = {
  testEnvironment: "node",
  // Only .test.(js|mjs) files, adjust if you like
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  // We’re using native ESM, no transpile
  transform: {},
  setupFiles: ['<rootDir>/server/__tests__/jest.setup.js'],

};