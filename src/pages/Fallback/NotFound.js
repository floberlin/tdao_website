import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import wait from "../../assets/tdao.svg";
import Fallback from "./Fallback";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t("helmet.title.notfound")} />
      <br />
      <br />

      <Fallback image={wait} text={t("page.notfound.text")} />
    </>
  );
};

export default NotFound;
