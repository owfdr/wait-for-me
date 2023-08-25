import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

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
    <div className="p-3 pt-10 max-w-sm mx-auto">
      <h1 className="text-3xl mb-10 ">{isAdd ? "Add" : "Edit"} Category</h1>
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
          className="block p-3 border rounded"
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
          className="block p-3 border rounded"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setEdited(true);
          }}
        />
        <button
          type="submit"
          disabled={!edited || isDuplicated || !name}
          className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded disabled:opacity-50 disabled:hover:bg-blue-500 transition duration-150 ease-in-out"
        >
          {isAdd ? "Add" : "Update"}
        </button>
        <Link
          to="/categories"
          className="p-3 block text-center bg-gray-300 text-gray-700 hover:bg-gray-400 rounded transition duration-150 ease-in-out"
        >
          Cancel
        </Link>
        <button
          className="p-3  text-red-500 border border-white hover:border-red-600 rounded mt-5 duration-150 ease-in-out disabled:opacity-50 disabled:hover:border-white"
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
        <p className="text-red-300 text-sm text-center" hidden={isAdd}>
          {!safeToDelete &&
            "You must remove all the records before deleting it"}
        </p>
      </form>
    </div>
  );
}
