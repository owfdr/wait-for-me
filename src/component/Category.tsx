import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Layout from "../ui/Layout";
import Navbar from "../ui/Navbar";

export default function Category() {
  const { pathname } = useLocation();
  const { category_id } = useParams();

  const isAdd = pathname.endsWith("_add_");
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [edited, setEdited] = React.useState(false);
  const [isDuplicated, setIsDuplicated] = React.useState(false);
  const [safeToDelete, setSafeToDelete] = React.useState(false);

  useEffect(() => {
    if (category_id) {
      window.electron.getCategory(category_id).then((category) => {
        setName(category.name);
        setPassword(category.password || "");
      });

      window.electron
        .doesCategoryHaveRecords(category_id)
        .then((haveRecords) => {
          setSafeToDelete(!haveRecords);
        });
    }
  }, []);

  useEffect(() => {
    if (name && edited) {
      window.electron
        .isCategoryNameDuplicated(category_id, name)
        .then(setIsDuplicated);
    }
  }, [name]);

  return (
    <Layout title="Categories" to="/">
      <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-lg  bg-white p-5 shadow-sm">
        <h1 className="mb-10 text-3xl ">{isAdd ? "Add" : "Edit"} Category</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (event) => {
            event.preventDefault();

            if (isAdd) {
              await window.electron.addCategory({
                id: nanoid(),
                name,
                password: password,
              });
            } else {
              await window.electron.updateCategory({
                id: category_id,
                name,
                password: password,
              });
            }

            navigate("/categories");
          }}
        >
          <input
            type="text"
            placeholder="name"
            className="block rounded border p-3"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setEdited(true);
            }}
          />
          <p hidden={!isDuplicated} className="text-red-500">
            name can't be duplicated
          </p>
          <input
            type="password"
            placeholder="password (optional)"
            className="block rounded border p-3"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setEdited(true);
            }}
          />
          <button
            type="submit"
            disabled={!edited || isDuplicated || !name}
            className="rounded bg-blue-500 p-3 text-white transition duration-150 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            {isAdd ? "Add" : "Update"}
          </button>
          <Link
            to="/categories"
            className="block rounded bg-gray-300 p-3 text-center text-gray-700 transition duration-150 ease-in-out hover:bg-gray-400"
          >
            Cancel
          </Link>
          <button
            className="mt-5  rounded border border-white p-3 text-red-500 duration-150 ease-in-out hover:border-red-600 disabled:opacity-50 disabled:hover:border-white"
            hidden={isAdd}
            disabled={!safeToDelete}
            onClick={async (event) => {
              event.preventDefault();
              if (category_id) {
                await window.electron.removeCategory(category_id);
                navigate("/categories");
              }
            }}
          >
            Delete
          </button>
          <p className="text-center text-sm text-red-300" hidden={isAdd}>
            {!safeToDelete &&
              "You must remove all the records before deleting it"}
          </p>
        </form>
      </div>
    </Layout>
  );
}
