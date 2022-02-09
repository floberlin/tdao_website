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

const TodoList = () => {

  return (
    <CenteredContent>
      <Helmet title="List - tDAO Website" />
      <Title level={TitleLevel.H1}>Todo List</Title>
      <br />

    </CenteredContent>
  );
};

export default TodoList;
