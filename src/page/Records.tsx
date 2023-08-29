import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";

import "../../assets/white-background.jpg";
import { Category, Record } from "../class/Store";
import Grid from "../ui/Grid";
import Layout from "../ui/Layout";

export default function Records() {
  const { state } = useLocation();
  const { category_id } = useParams();
  const { t } = useTranslation();

  const [password, setPassword] = React.useState<string>("");
  const [locked, setLocked] = React.useState<boolean>(true);
  const [fetched, setFetched] = React.useState<boolean>(false);

  const [category, setCategory] = React.useState<Partial<Category>>({});
  const [records, setRecords] = React.useState<Record[]>([]);

  const [refresh, setRefresh] = React.useState(0);
  const [watchFilter, setWatchFilter] = React.useState(0);

  useEffect(() => {
    window.electron.getCategory(category_id).then((category) => {
      if (state?.password) {
        setPassword(state.password);
        setLocked(false);
      } else if (category.password) {
        setPassword(category.password);
        setLocked(true);
      } else {
        setLocked(false);
      }

      setCategory(category);
      window.electron.getRecordsByCategory(category_id).then(setRecords);

      setFetched(true);
    });
  }, []);

  useEffect(() => {
    window.electron
      .getRecordsByCategory(category_id)
      .then((result: Record[]) => {
        switch (watchFilter) {
          case 0:
            return setRecords(result);
          case 1:
            return setRecords(result.filter((record) => record.stage < 2));
          case 2:
            return setRecords(result.filter((record) => record.stage === 2));
          default:
            return setRecords(result);
        }
      })
      .catch(console.log);
  }, [refresh, watchFilter]);

  const whichWatchFilter = (filter: number) => {
    switch (filter) {
      case 0:
        return "All Combined";
      case 1:
        return "Not Watched";
      case 2:
        return "Watched";
      default:
        return "Unknown";
    }
  };

  const whichStage = (stage: number) => {
    switch (stage) {
      case 0:
        return t("not-watched");
      case 1:
        return t("watching");
      case 2:
        return t("watched");
      default:
        return t("not-watched");
    }
  };

  const whichUpvote = (upvote: number) => {
    switch (upvote) {
      case -1:
        return "👎";
      case 0:
        return "";
      case 1:
        return "👍";
      default:
        return "";
    }
  };

  if (!category || !fetched)
    return (
      <Layout title={category.name} lock={!!password} to="/">
        <div></div>
      </Layout>
    );

  if (locked)
    return (
      <Layout title={category.name} lock={!!password} to="/">
        <div className="mx-auto mb-10 mt-20 max-w-sm">
          <p className="m-1">{t("enter-password-to-unlock")}</p>
          <input
            type="password"
            className="w-full rounded border p-2"
            onChange={(event) => {
              if (event.target.value === password) {
                setLocked(false);
              }
            }}
          ></input>
        </div>
      </Layout>
    );

  return (
    <Layout title={category.name} unlocked={password && !locked} to="/">
      {/* <div className="border-b flex">
        <input
          type="text"
          placeholder="Search"
          className="p-2 grow"
          // onInput={(event) => {
          //   const input = event.target as HTMLInputElement;
          //   const { value } = input;
          //   if (value !== "") {
          //     window.electron
          //       .filterRecordByTitle(value)
          //       .then(setData)
          //       .catch(console.log);
          //   } else {
          //     window.electron.getAllData().then(setData).catch(console.log);
          //   }
          // }}
        />
        <button
          type="button"
          className="text-sm p-3 rounded text-gray-500 hover:text-gray-700 transition duration-150 ease-out"
          onClick={(event) => {
            event.preventDefault();
            if (watchFilter < 2) {
              setWatchFilter((prev) => prev + 1);
            } else {
              setWatchFilter(0);
            }
          }}
        >
          {whichWatchFilter(watchFilter)}
        </button>
      </div> */}

      <Grid wide state={{ password }}>
        {records.map((record) => (
          <div
            key={record.id}
            className={`m-3 overflow-hidden rounded-xl p-3 text-gray-900 transition duration-150 ease-in-out ${
              record.stage === 2 && "opacity-50"
            } ${record.stage === 1 && "bg-gray-200 shadow-lg shadow-gray-100"}`}
          >
            <a
              href={record.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg transition duration-150 ease-in-out hover:shadow-md"
              onClick={(event) => {
                event.preventDefault();
                record.sourceUrl && window.electron.openUrl(record.sourceUrl);
              }}
            >
              <img
                src={record.imageUrl || "assets/white-background.jpg"}
                alt={record.name}
                className="mx-auto h-60 max-w-md overflow-hidden rounded-lg object-cover object-center"
              />
            </a>
            <div className="mt-2 flex overflow-hidden">
              <div className="overflow-hidden">
                <div className="flex overflow-hidden">
                  <p className="inline-block truncate font-medium">
                    {record.name}
                  </p>
                  <Link
                    className="mb-auto ml-3 text-sm font-bold text-gray-400 transition duration-150 ease-out hover:text-gray-500"
                    to={`_edit_/${record.id}`}
                    state={{ password }}
                  >
                    ...
                  </Link>
                </div>
                <div>
                  <button
                    type="button"
                    className={`inline-block text-sm text-gray-500 ${
                      record.stage === 1 && "animate-pulse"
                    }`}
                    onClick={async (event) => {
                      event.preventDefault();
                      if (record.stage < 2) {
                        await window.electron.updateRecord({
                          ...record,
                          stage: record.stage + 1,
                        } as Record);
                      } else {
                        await window.electron.updateRecord({
                          ...record,
                          stage: 0,
                        } as Record);
                      }
                      setRefresh((prev) => prev + 1);
                    }}
                  >
                    {whichStage(record.stage)}
                  </button>
                  <span className="ml-2 text-sm">
                    {whichUpvote(record.upvote)}
                  </span>
                </div>
              </div>
              {record.stage < 2 && (
                <button
                  type="button"
                  className="mb-1 ml-auto mt-auto shrink-0 rounded-lg px-2 py-1 font-medium text-blue-500 transition duration-150 ease-out hover:bg-blue-500 hover:text-white"
                  onClick={async (event) => {
                    event.preventDefault();
                    await window.electron.updateRecord({
                      ...record,
                      stage: record.stage + 1,
                    } as Record);
                    setRefresh((prev) => prev + 1);
                  }}
                >
                  {record.stage === 0 ? t("start") : t("done")}
                </button>
              )}
            </div>
          </div>
        ))}
      </Grid>
    </Layout>
  );
}
