import "ts-node/register"; // Add this to import TypeScript files
import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "timer-list",
  slug: "timer-list",
  scheme: "timer-list",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.prncssxyz.timerlist",
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.CAMERA",
    ],
  },
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
    output: "static",
  },
  plugins: ["expo-router"],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "d2ffcf8f-d946-4d83-9691-add36120da7b",
    },
  },
  experiments: {
    baseUrl: process.env.BASE_URL ?? "/timer-list",
    typedRoutes: true,
  },
};

export default config;
