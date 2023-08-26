import React from "react";
import { createHashRouter, redirect } from "react-router-dom";

import Categories from "../component/Categories";
import Category from "../component/Category";
import Record from "../component/Record";
import Records from "../component/Records";

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
