import React from "react";
import { Link } from "react-router-dom";

import { Category } from "../class/Store";

export default function categories() {
  const [categories, setCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
    window.electron.getCategories().then(setCategories);
  });

  return (
    <div className="p-10">
      <h1 className="mb-10 text-3xl">Categories</h1>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative rounded border p-3 px-4 text-center"
          >
            <Link to={category.id + "/records"}>{category.name}</Link>
            <Link
              to={"_edit_/" + category.id}
              className="absolute right-0 top-0 mr-1 text-xs text-gray-300 transition duration-150 ease-in-out hover:text-gray-800"
            >
              ...
            </Link>
          </div>
        ))}
        <div key="add" className="rounded border p-3 px-4 text-center">
          <Link to="_add_">➕</Link>
        </div>
      </div>
    </div>
  );
}
