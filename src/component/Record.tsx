import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Category, Record } from "../class/Store";
import { nanoid } from "nanoid";

export default function Record() {
  const { pathname, state } = useLocation();
  const { category_id, record_id } = useParams();

  const [category, setCategory] = React.useState<Partial<Category>>({});

  const isAdd = pathname.endsWith("_add_");
  const navigate = useNavigate();
  const password = state.password || "";

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [stage, setStage] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [upvote, setUpvote] = React.useState(0);

  const [edited, setEdited] = React.useState(false);
  const [isDuplicated, setIsDuplicated] = React.useState(false);

  useEffect(() => {
    window.electron.getCategory(category_id).then(setCategory);

    if (record_id) {
      window.electron.getRecord(record_id).then((record) => {
        setId(record.id);
        setName(record.name);
        setImageUrl(record.imageUrl);
        setSourceUrl(record.sourceUrl);
        setStage(record.state);
        setNote(record.note);
        setUpvote(record.upvote);
      });
    }
  }, []);

  useEffect(() => {
    if (name && edited) {
      window.electron
        .isRecordNameDuplicated(record_id, name)
        .then(setIsDuplicated);
    }
  }, [name]);

  return (
    <div className="p-3 pt-10 max-w-sm mx-auto">
      <h1 className="text-3xl mb-10 ">{isAdd ? "Add" : "Edit"} Record</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (isAdd) {
            await window.electron.addRecord({
              id: nanoid(),
              name,
              imageUrl,
              sourceUrl,
              stage,
              note,
              upvote,
              tags: [],
              categoryId: category.id,
            });
          } else {
            await window.electron.updateRecord({
              id,
              name,
              imageUrl,
              sourceUrl,
              stage,
              note,
              upvote,
              tags: [],
              categoryId: category.id,
            });
          }

          navigate("/categories/" + category_id + "/records", {
            state: { password },
          });
        }}
        className="flex flex-col gap-4 p-3 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="name"
          className="block  p-3"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setEdited(true);
          }}
        />
        <input
          type="text"
          placeholder="sourceUrl"
          className="block p-3"
          value={sourceUrl}
          onChange={(event) => {
            setSourceUrl(event.target.value);
            setEdited(true);
          }}
        />
        <input
          type="text"
          placeholder="imageUrl"
          className="block p-3"
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setEdited(true);
          }}
        />
        <textarea
          placeholder="note"
          className="block p-3"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setEdited(true);
          }}
        />
        <div className="p-3 flex gap-3 text-xl">
          <label htmlFor="bad">
            👎
            <input
              type="radio"
              name="upvote"
              value="-1"
              id="bad"
              checked={upvote === -1}
              onChange={() => {
                setUpvote(-1);
                setEdited(true);
              }}
            />
          </label>
          <label htmlFor="good">
            👍
            <input
              type="radio"
              name="upvote"
              value="1"
              id="good"
              checked={upvote === 1}
              onChange={() => {
                setUpvote(1);
                setEdited(true);
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!edited || isDuplicated || !name}
          className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded disabled:opacity-50 disabled:hover:bg-blue-500 transition duration-150 ease-in-out"
        >
          {isAdd ? "Add" : "Update"}
        </button>
        <Link
          to={"/categories/" + category_id + "/records"}
          state={{ password }}
          className="p-3 block text-center bg-gray-300 text-gray-700 hover:bg-gray-400 rounded transition duration-150 ease-in-out"
        >
          Cancel
        </Link>

        <button
          type="submit"
          hidden={isAdd}
          className="p-3  text-red-500 border border-white hover:border-red-600 rounded mt-5 duration-150 ease-in-out disabled:opacity-50 disabled:hover:border-white"
          onClick={async (event) => {
            event.preventDefault();
            if (!window.confirm("Are you sure to delete this record?")) return;

            await window.electron.deleteRecord(record_id);
            navigate("/categories/" + category_id + "/records", {
              state: { password },
            });
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
