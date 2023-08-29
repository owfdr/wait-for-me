import React from "react";
import { useTranslation } from "react-i18next";
import { IoConstructOutline } from "react-icons/io5";

import Layout from "../ui/Layout";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <Layout title={t("settings")} to="/">
      <div className="mx-10 rounded-lg bg-white p-10 text-center shadow-sm">
        <IoConstructOutline className="mx-auto mb-3 text-3xl" />
        <p>{t("still-under-development")}</p>
      </div>
    </Layout>
  );
}
