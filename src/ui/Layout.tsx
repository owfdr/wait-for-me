import React from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({
  children,
  title,
  to,
  lock,
  unlocked,
}: {
  children: React.ReactNode;
  title: string;
  to: string;
  lock?: boolean;
  unlocked?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <Navbar
        title={title}
        lock={lock}
        unlocked={unlocked}
        to={to}
        className="mb-10"
      />
      {children}
      <Footer />
    </div>
  );
}
