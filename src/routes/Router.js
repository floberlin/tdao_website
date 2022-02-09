import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { BusyIndicator } from "@ui5/webcomponents-react";
import { ROUTES } from "./Routes";

const TodoList = lazy(() => import("../pages/Todo/List/TodoList"));
const TodoEdit = lazy(() => import("../pages/Todo/Edit/TodoEdit"));
const NotFound = lazy(() => import("../pages/Fallback/NotFound"));
const Buggy = lazy(() => import("../pages/Fallback/Buggy"));

const Router = () => {
  return (
    <Suspense fallback={<BusyIndicator active />}>
      <Switch>
        <Redirect path={ROUTES.HOME} exact to={ROUTES.TODO_LIST} />
        <Route path={ROUTES.BUGGY} exact component={Buggy} />
        <Route path={ROUTES.NOT_FOUND} exact component={NotFound} />
        <Route path={ROUTES.ANY} component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default Router;
