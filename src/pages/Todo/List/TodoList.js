import React from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import {
  isDesktop,
  isTablet,
  isPhone,
} from "@ui5/webcomponents-base/dist/Device.js";
import { Link, Text, Title, TitleLevel } from "@ui5/webcomponents-react";
import CenteredContent from "../../../components/Layout/CenteredContent";
import { ROUTES } from "../../../routes/Routes";
import { useTranslation } from "react-i18next";




const TodoList = () => {
  const { t } = useTranslation();
  return (
    <CenteredContent>
      <Helmet title={t("helmet.title.notfound")} />
      <Title level={TitleLevel.H1}>{t("page.notfound.text")}</Title>
      <br />
    </CenteredContent>
  );
};

export default TodoList;
