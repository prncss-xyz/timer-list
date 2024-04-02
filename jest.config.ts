import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))",
  ],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/__tests__/**"],
  testPathIgnorePatterns: ["tests/"],
};

export default config;
