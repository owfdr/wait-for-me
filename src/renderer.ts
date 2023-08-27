import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import Router from "./class/Router";
import "./index.css";
import { ElectronHandler } from "./preload";
import en from "./translation/en.json";
import ja from "./translation/ja.json";
import ko from "./translation/ko.json";
import zh from "./translation/zh.json";

declare global {
  interface Window {
    i18next: typeof i18next;
    electron: ElectronHandler;
  }
}

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    resources: {
      en: {
        translation: en,
      },
      ja: {
        translation: ja,
      },
      ko: {
        translation: ko,
      },
      zh: {
        translation: zh,
      },
    },
  });

window.i18next = i18next;

const container = document.getElementById("root") as HTMLElement;
const router = Router.createHash();
const root = createRoot(container);

root.render(
  React.createElement(
    I18nextProvider,
    { i18n: i18next },
    React.createElement(RouterProvider, { router }),
  ),
);
