import React from "react";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "@ui5/webcomponents-react";
import ErrorBoundary from "./pages/Fallback/ErrorBoundary";
import Shell from "./components/Shell/Shell";
import Router from "./routes/Router";

const App = () => {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <HashRouter>
        <Helmet title={t("helmet.title.app")} />
        <Shell title={t("shell.title")} />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
