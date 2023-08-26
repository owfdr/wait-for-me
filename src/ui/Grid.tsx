import React from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Grid({
  children,
  state,
}: {
  children: React.ReactNode;
  state?: { password: string };
}) {
  return (
    <div className="mx-10 overflow-hidden rounded-lg shadow-sm">
      <div className="grid gap-px rounded-b-none bg-white sm:grid-cols-2 md:grid-cols-3">
        {children}
      </div>
      <Link to="_add_" state={state}>
        <div className="rounded-b-lg border-t border-gray-100 bg-white p-3 transition duration-150 ease-in-out hover:shadow">
          <HiPlus className="mx-auto text-gray-700 transition duration-150 ease-in-out hover:text-gray-900" />
        </div>
      </Link>
    </div>
  );
}
