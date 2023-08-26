import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import Router from "./class/Router";
import "./index.css";
import { ElectronHandler } from "./preload";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

const container = document.getElementById("root") as HTMLElement;
const router = Router.createHash();
const root = createRoot(container);

root.render(React.createElement(RouterProvider, { router }));
