import React from "react";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`mt-8 pb-3 text-center text-xs text-gray-300 ${className}`}
    >
      {new Date().getFullYear()} Wait For Me
    </footer>
  );
}
