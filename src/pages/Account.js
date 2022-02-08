import {
  ThemeProvider,
} from "@ui5/webcomponents-react";
import React from "react";
import "./Account.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Blockies from "react-blockies";

function App() {

  return (
    <ThemeProvider>
      <div className="Account">
        <br></br>
        <br></br>
        <Blockies
          seed={"0x" + (window.location.href).split('0x')[1]}
          size={15}
          scale={8}
          color="#dfe"
          bgColor="#ffe"
          spotColor="#abc"
        />
        <h6>{"0x" + (window.location.href).split('0x')[1]}</h6>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </ThemeProvider>
  );
}

export default App;
