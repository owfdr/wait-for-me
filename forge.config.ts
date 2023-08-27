import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import type { ForgeConfig } from "@electron-forge/shared-types";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    name: "Wait For Me",
    icon: "./assets/icon",
    appBundleId: "com.owfdr.wait-for-me",
    executableName: "wait-for-me", // required for linux
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl:
        "https://raw.githubusercontent.com/owfdr/wait-for-me/main/assets/icon.ico",
      setupIcon: "./assets/icon.ico",
    }),
    new MakerZIP({}, ["darwin", "win32"]),
    new MakerRpm({
      options: {
        icon: "./assets/icon.png",
        productName: "Wait For Me",
        description: "Build your personal collections",
        productDescription:
          "Craft your own personal collections of your favorite shows, movies, articles, and more.",
        categories: ["Utility"],
      },
    }),
    new MakerDeb({
      options: {
        icon: "./assets/icon.png",
        productName: "Wait For Me",
        description: "Build your personal collections",
        productDescription:
          "Craft your own personal collections of your favorite shows, movies, articles, and more.",
        categories: ["Utility"],
      },
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy:
        "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; img-src *;",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
