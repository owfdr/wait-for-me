import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Category, Record } from "../class/Store";

export default function Records() {
  const { state } = useLocation();
  const { category_id } = useParams();

  const [password, setPassword] = React.useState<string>("");
  const [locked, setLocked] = React.useState<boolean>(true);

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
        return "Not Watched";
      case 1:
        return "Watching";
      case 2:
        return "Watched";
      default:
        return "Not Watched";
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

  if (!category) return <div />;

  if (locked)
    return (
      <div className="p-10">
        <h1 className="text-3xl mb-10">
          <Link to="/">{category.name}</Link>
          <span> 🔒</span>
        </h1>

        <div className="pt-10 max-w-sm mx-auto">
          <p className="mt-10 mb-1">Enter your Password to unlock:</p>
          <input
            type="password"
            className="p-2 border rounded w-full"
            onChange={(event) => {
              if (event.target.value === password) {
                setLocked(false);
              }
            }}
          ></input>
        </div>
      </div>
    );

  return (
    <div className="">
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

      <div className="p-10">
        <h1 className="text-3xl mb-10">
          <Link to="/">{category.name}</Link>
          <span>{password && " 🔓"}</span>
        </h1>
        <div className="flex gap-4 p-3 flex-wrap mx-auto w-full">
          {records.map((record) => (
            <div
              key={record.id}
              className={`p-4 overflow-hidden rounded-xl w-96 text-gray-900 transition duration-150 ease-in-out ${
                record.stage === 2 && "opacity-50"
              } ${
                record.stage === 1 && "bg-gray-200 shadow-lg shadow-gray-100"
              }`}
            >
              <a
                href={record.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg overflow-hidden hover:shadow-md transition duration-150 ease-in-out"
                onClick={(event) => {
                  event.preventDefault();
                  window.electron.openUrl(record.sourceUrl);
                }}
              >
                <img
                  src={record.imageUrl}
                  alt={record.name}
                  className="max-w-md mx-auto h-60 overflow-hidden rounded-lg"
                />
              </a>
              <div className="flex mt-2 overflow-hidden">
                <div className="overflow-hidden">
                  <div className="overflow-hidden flex">
                    <p className="font-medium inline-block truncate">
                      {record.name}
                    </p>
                    <Link
                      className="text-gray-400 font-bold text-sm hover:text-gray-500 mb-auto ml-3 transition duration-150 ease-out"
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
                    className="rounded-lg font-medium px-2 py-1 mt-auto mb-1 ml-auto text-blue-500 hover:bg-blue-500 hover:text-white transition duration-150 ease-out"
                    onClick={async (event) => {
                      event.preventDefault();
                      await window.electron.updateRecord({
                        ...record,
                        stage: record.stage + 1,
                      } as Record);
                      setRefresh((prev) => prev + 1);
                    }}
                  >
                    {record.stage === 0 ? "Start" : "Done"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-4">
            <div
              key="add"
              className=" rounded p-3 px-4 text-center border border-gray-100"
            >
              <Link to="_add_" state={{ password }}>
                ➕
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
