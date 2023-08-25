import React from "react";
import { Category } from "../class/Store";
import { Link } from "react-router-dom";

export default function categories() {
  const [categories, setCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
    window.electron.getCategories().then(setCategories);
  });

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-10">Categories</h1>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded p-3 px-4 text-center relative"
          >
            <Link to={category.id + "/records"}>{category.name}</Link>
            <Link
              to={"_edit_/" + category.id}
              className="absolute top-0 right-0 mr-1 text-xs text-gray-300 hover:text-gray-800 transition duration-150 ease-in-out"
            >
              ...
            </Link>
          </div>
        ))}
        <div key="add" className="border rounded p-3 px-4 text-center">
          <Link to="_add_">➕</Link>
        </div>
      </div>
    </div>
  );
}
