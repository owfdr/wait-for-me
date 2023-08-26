import React from "react";
import { Link } from "react-router-dom";

import "../../assets/icon.png";
import { Category } from "../class/Store";
import Navbar from "../ui/Navbar";

export default function categories() {
  const [categories, setCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
    window.electron.getCategories().then(setCategories);
  });

  return (
    <div className="h-screen bg-gray-50 text-gray-700">
      <Navbar title="Categories" className="mb-10" />
      <div className="mx-10 overflow-hidden rounded-lg shadow-sm">
        <div className="grid gap-px rounded-b-none bg-white sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <Link to={category.id + "/records"} key={category.id}>
                <div className="h-10 w-10 rounded bg-gray-100"></div>
                <h2 className="mb-1 mt-3 line-clamp-1 font-medium text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-900">
                  {category.name}
                </h2>
                <p className="line-clamp-2 text-sm text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-700">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Tempore corporis explicabo assumenda fugiat consectetur nam
                  quis laboriosam, vitae quas eveniet a sapiente labore
                  accusamus accusantium voluptatum, debitis nihil aperiam omnis.
                </p>
              </Link>
              <Link
                to={"_edit_/" + category.id}
                className="absolute right-4 top-2 p-1 text-sm text-gray-300 transition duration-150 ease-in-out hover:text-gray-800"
              >
                ...
              </Link>
            </Card>
          ))}
        </div>
        <Link to="_add_">
          <div className="rounded-b-lg border-t border-gray-100 bg-white p-3 transition duration-150 ease-in-out hover:shadow">
            <div className="text-center text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-900">
              ➕
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-8 text-center text-xs text-gray-300">
        {new Date().getFullYear()} Wait For Me
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex h-40 flex-col bg-white p-5">
      <div className="my-auto">{children}</div>
    </div>
  );
}
