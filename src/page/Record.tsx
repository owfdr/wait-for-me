import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { Category } from "../class/Store";
import Layout from "../ui/Layout";

export default function Record() {
  const { pathname, state } = useLocation();
  const { category_id, record_id } = useParams();
  const { t } = useTranslation();

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
    <Layout title={category.name} to="/">
      <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-lg bg-white p-5 shadow-sm">
        <h1 className="mb-10 text-3xl ">
          {isAdd ? t("add-record") : t("edit-record")}
        </h1>

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
          className="mx-auto flex max-w-xl flex-col gap-4 p-3"
        >
          <input
            type="text"
            placeholder={t("name")}
            className="block rounded border p-3"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setEdited(true);
            }}
          />
          <input
            type="text"
            placeholder={t("website-url-optional")}
            className="block rounded border p-3"
            value={sourceUrl}
            onChange={(event) => {
              setSourceUrl(event.target.value);
              setEdited(true);
            }}
          />
          <input
            type="text"
            placeholder={t("image-url-optional")}
            className="block rounded border p-3"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value);
              setEdited(true);
            }}
          />
          <textarea
            placeholder={t("note-optional")}
            className="block rounded border p-3"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setEdited(true);
            }}
          />
          <div className="flex gap-3 p-3 text-xl">
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
            className="rounded bg-blue-500 p-3 text-white transition duration-150 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            {isAdd ? t("add") : t("update")}
          </button>
          <Link
            to={"/categories/" + category_id + "/records"}
            state={{ password }}
            className="block rounded bg-gray-300 p-3 text-center text-gray-700 transition duration-150 ease-in-out hover:bg-gray-400"
          >
            {t("cancel")}
          </Link>

          <button
            type="submit"
            hidden={isAdd}
            className="mt-5 rounded border border-white p-3 text-red-500 duration-150 ease-in-out hover:border-red-600 disabled:opacity-50 disabled:hover:border-white"
            onClick={async (event) => {
              event.preventDefault();
              if (!window.confirm(t("sure-to-delete"))) return;

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
    </Layout>
  );
}
