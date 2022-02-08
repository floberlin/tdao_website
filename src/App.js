import {
  ShellBar,
  ThemeProvider,
  Input,
  Avatar,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Icon,
  Button,
  Popover,
  RadioButton,
  TextArea,
} from "@ui5/webcomponents-react";
// eslint-disable-next-line no-unused-vars
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Route, HashRouter } from "react-router-dom";
import Asset from "./pages/Asset";
import QR from "./pages/QR";
import Error from "./pages/Error";
import Account from "./pages/Account";
import abi from "./abi.json";
import { isMobile } from "react-device-detect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import { useTranslation } from "react-i18next";

let provider = null;
let signer = null;
let address = null;
let roProvidernoUser = new ethers.providers.JsonRpcProvider(
  "https://polygon-mainnet.infura.io/v3/d8e7160dc78d48dba6ca40b11fdf1cd5" ||
    "https://rpc-mainnet.matic.network"
);
let tdao = new ethers.Contract(
  "0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3",
  abi,
  roProvidernoUser
);
const roProvider = new WalletConnectProvider({
  rpc: {
    137: "https://polygon-mainnet.infura.io/v3/d8e7160dc78d48dba6ca40b11fdf1cd5",
  },
});

export async function ethersConnect() {
  try {
    if (isMobile) {
      await roProvider.enable();
      provider = new ethers.providers.Web3Provider(roProvider);
    } else {
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
    }

    //[provider.getBlockNumber().then((b) => b - 10000),provider.getBlockNumber().then((b) => b )]

    signer = provider.getSigner();
    address = await signer.getAddress();
    tdao = new ethers.Contract(
      "0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3",
      abi,
      signer
    );

    //  let filter = tdao.filters.TransferSingle();
    // console.log(filter)
    // console.log(await tdao.filter.TransferSingle());
    // console.log(await tdao.queryFilter(filter, 17862525 , 17862925));

    return await signer.getAddress();
  } catch (error) {
    //alert("Please install Metamask!")
    console.log("e :" + error);

    return "Read only";
  }
}

export async function getTokenId(ipfsId) {
  try {
    ipfsId = ipfsId.split("/")[0];
    const rslt = tdao.getTokenId(ipfsId).then((result) => {
      return result.toNumber();
    });
    return rslt;
  } catch {
    return "";
  }
}

function handleSearch(value) {
  window.location.assign("/#/asset/" + value);
}

function handleAccount(value) {
  window.location.assign("/#/account/" + address);
}

function handleQR() {
  window.location.assign("/#/qr");
}

function handleHome() {
  window.location.assign("/#/");
}

setTheme("sap_horizon");

function App() {
  const [value, setValue] = useState("");
  const [menu, setMenu] = useState("none");
  const [profile, setProfile] = useState(false);
  const { t } = useTranslation();

  const popoverRef = useRef();
  const popoverRefHelp = useRef();
  const onButtonClick = (e) => {
    popoverRef.current.showAt(e.target);
  };
  const onButtonClickHelp = (e) => {
    popoverRefHelp.current.showAt(e.target);
  };
  const handleClose = () => {
    popoverRef.current.close();
    popoverRefHelp.current.close();
  };

  const [userAddress, setuserAddress] = useState(t("wallet"));
  return (
    <ThemeProvider>
      <HashRouter>
        <div id="shellbarDiv">
          <ShellBar
            id="shellbar"
            // primary-title="Home"
            logo={
              <img
                alt="tdao"
                mdxtype="img"
                originaltype="img"
                src="../tdao_cropped.svg"
              />
            }
            onLogoClick={() => handleHome()}
            onMenuItemClick={function noRefCheck() {}}
            style={{ overflow: "auto" }}
            className="Shell"
            onProfileClick={() => setMenu("block")}
            
            profile={
              <Avatar
                icon="menu2"
                colorScheme="Accent10"
                size="XS"
                shape="Square"
              ></Avatar>
            }
          >
          </ShellBar>
        </div>
        <div className="Menu" style={{ display: menu }}>
          <SideNavigation
            className="Menu"
            fixedItems={
              <>
                <SideNavigationItem
                  icon="information"
                  text={t("imprint")}
                  onClick={() =>
                    window.location.replace(
                      "https://www.t-systems.com/de/en/imprint"
                    )
                  }
                />
              </>
            }
            onSelectionChange={function noRefCheck() {}}
            slot=""
            style={{}}
            tooltip=""
          >
            <SideNavigationItem
              icon="nav-back"
              text={t("back")}
              onClick={() => setMenu("none")}
            />
            <SideNavigationItem
              icon="group"
              onSelectionChange={function noRefCheck() {}}
              onClick={() =>
                ethersConnect().then((a) => {
                  setuserAddress(a.substring(0, 6) + "..." + a.slice(-4));
                  setProfile(!profile);
                })
              }
              onChange={(e) => setuserAddress(e.target.userAddress)}
              text={userAddress}
              tooltip={userAddress}
            >
              <SideNavigationSubItem
                text="Account"
                icon="customer"
                onClick={() => {
                  handleAccount();
                  setMenu("none");
                }}
              />
            </SideNavigationItem>
          </SideNavigation>
        </div>
        <div id="content">
          <Route exact strict path="/">
            <div className="App">
              <div className="Scan">
                <Avatar
                  colorScheme="Accent6"
                  size="XL"
                  icon="bar-code"
                  onClick={() => handleQR()}
                  tooltip="Click to Scan QR-Code"
                />
              </div>
              <div className="Search">
                <Input
                  onChange={(e) => setValue(e.target.value)}
                  style={{}}
                  type="Text"
                  placeholder={t("search")}
                  icon={
                    <Icon name="search" onClick={() => handleSearch(value)} />
                  }
                />
              </div>
            </div>
          </Route>
          <Route path="/asset">
            <Asset />
          </Route>
          <Route path="/qr">
            <QR />
          </Route>
          <Route path="/error">
            <Error />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
        </div>
      </HashRouter>
      <div className="Feedback-wrapper">
        <Button onClick={onButtonClick} design="Default">
          Feedback
        </Button>
      </div>
      <div>
        <Popover
          className="Feedback-wrapper-open"
          ref={popoverRef}
          // header={<Icon style={{ fontSize: "4rem" }} name="feedback" />}
          headerText={t("appreciate")}
          footer={
            <>
              <Button design="Emphasized">Send</Button>
              <Button
                onClick={function () {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </>
          }
        >
          <RadioButton group="Feedback" text={t("helpful")} />
          <RadioButton group="Feedback" text={t("!helpful")} />
          <TextArea placeholder={t("experience")} />
          <br />
          <p className="Feedback-disclaimer">
            {t("feedback")}
          </p>
          {/* <Button
            onClick={function () {
              handleClose();
            }}
          >
            Close Popover
          </Button> */}
        </Popover>
      </div>
      <div className="Help-wrapper">
        <Button onClick={onButtonClickHelp} design="Emphasized">
          Info
        </Button>
      </div>
      <div>
        <Popover
          className="Help-wrapper-open"
          ref={popoverRefHelp}
          headerText="Information about our project"
          footer={
            <>
              <Button design="Emphasized"
                onClick={function () {
                  handleClose();
                }}
              >
                OK
              </Button>
            </>
          }
        >
          tDAO is a decentralized application that allows you to create and manage your own supply chain assets.
        </Popover>
      </div>
    </ThemeProvider>
  );
}

export default App;
