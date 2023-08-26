import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({
  className,
  title,
  to,
}: {
  className?: string;
  title: string;
  to?: string;
}) {
  return (
    <nav
      className={`flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-3 ${className}`}
    >
      <Link to="/">
        <img
          src="assets/icon.png"
          alt="logo"
          className=" inline-block w-10 transition duration-150 ease-in-out"
        />
      </Link>
      <span>/</span>
      <Link to={to}>
        <h1 className="inline-block text-2xl tracking-tight text-gray-700 transition duration-150 ease-in-out hover:text-gray-900">
          {title}
        </h1>
      </Link>
      <Link
        to="/"
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border transition duration-150 ease-in-out hover:bg-gray-100"
      >
        ⚙️
      </Link>
    </nav>
  );
}
