import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-react/dist/Assets";
import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import WebFont from "webfontloader";

ReactDOM.render(<App />, document.getElementById("root"));

WebFont.load({
  google: {
    families: ["Josefin Sans:200", "sans-serif"],
  },
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
