import React from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({
  children,
  title,
  to,
}: {
  children: React.ReactNode;
  title: string;
  to: string;
}) {
  return (
    <div className="h-screen bg-gray-50 text-gray-700">
      <Navbar title={title} to={to} className="mb-10" />
      {children}
      <Footer />
    </div>
  );
}
