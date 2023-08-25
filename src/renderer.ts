import { ElectronHandler } from "./preload";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import React from "react";
import "./index.css";
import Router from "./class/Router";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

const container = document.getElementById("root") as HTMLElement;
const router = Router.createHash();
const root = createRoot(container);

root.render(React.createElement(RouterProvider, { router }));
