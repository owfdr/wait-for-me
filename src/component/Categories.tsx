import React from "react";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";

import "../../assets/icon.png";
import { Category } from "../class/Store";
import Grid from "../ui/Grid";
import Layout from "../ui/Layout";

export default function categories() {
  const [categories, setCategories] = React.useState([] as Category[]);

  React.useEffect(() => {
    window.electron.getCategories().then(setCategories);
  });

  return (
    <Layout title="Categories" to="/">
      <Grid>
        {categories.map((category) => (
          <Card key={category.id}>
            <Link to={category.id + "/records"} key={category.id}>
              <BiCategory className="flex h-10 w-10 items-center rounded border bg-gray-100 p-1 transition duration-150 ease-in-out hover:border-gray-500 group-hover:text-gray-900" />
              <h2 className="mb-1 mt-3 line-clamp-1 font-medium text-gray-700 transition duration-150 ease-in-out group-hover:text-gray-900">
                {category.name}
              </h2>
              <p className="line-clamp-2 text-sm text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-700">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Tempore corporis explicabo assumenda fugiat consectetur nam quis
                laboriosam, vitae quas eveniet a sapiente labore accusamus
                accusantium voluptatum, debitis nihil aperiam omnis.
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
      </Grid>
    </Layout>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex h-40 flex-col bg-white p-5">
      <div className="my-auto">{children}</div>
    </div>
  );
}
