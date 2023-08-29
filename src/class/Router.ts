import React from "react";
import { createHashRouter, redirect } from "react-router-dom";

import Categories from "../page/Categories";
import Category from "../page/Category";
import Record from "../page/Record";
import Records from "../page/Records";
import Settings from "../page/Settings";

export default class Router {
  static createHash() {
    return createHashRouter([
      {
        path: "/",
        loader: () => redirect("/categories"),
      },
      {
        path: "/main_window",
        loader: () => redirect("/categories"),
      },
      {
        path: "/settings",
        element: React.createElement(Settings),
      },
      {
        path: "/categories",
        element: React.createElement(Categories),
      },
      {
        path: "/categories/_add_",
        element: React.createElement(Category),
      },
      {
        path: "/categories/_edit_/:category_id",
        element: React.createElement(Category),
      },
      {
        path: "/categories/:category_id/records",
        element: React.createElement(Records),
      },
      {
        path: "/categories/:category_id/records/_add_",
        element: React.createElement(Record),
      },
      {
        path: "/categories/:category_id/records/_edit_/:record_id",
        element: React.createElement(Record),
      },
    ]);
  }
}
