import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-react/dist/Assets.js";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";

import React from "react";
import ReactDOM from "react-dom";

import "./util/i18n";
import App from "./App";
setTheme("sap_horizon");
ReactDOM.render(<App />, document.getElementById("root"));
