import {
  Timeline,
  TimelineItem,
  AnalyticalCardHeader,
  Card,
  MessageStrip,
  TableRow,
  TableCell,
  Carousel,
  CardHeader,
  Grid,
  Icon,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Asset.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { getTokenId } from "../App";
import addrMapping from "../addrMapping.json";
import { create } from "ipfs-http-client";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon
} from "react-share";

let assetipfs;
let center;

const containerStyle = {
  width: "100%",
  height: "250px",
};

async function getLogs_mint() {
  const transMinting = (
    await axios.get(
      'https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=17107829&toBlock="latest"&address=0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3&topic0=0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62&6topic0_2_opr=and&topic2=0x0000000000000000000000000000000000000000000000000000000000000000&apikey=MPENGZWJ5EVWFGKIB4WDEG6NX2YNH8XINQ'
    )
  ).data.result;
  const id = await getTokenId(assetipfs).then((id) =>
    (
      "000000000000000000000000000000000000000000000000000000000000000000" +
      id.toString(16)
    ).substr(-64)
  );
  let index;
  for (let i in transMinting) {
    index = transMinting[i].data.substr(-128).substr(0, 64) === id ? i : index;
  }
  const json = {
    DATE: new Date(
      parseInt(await (await transMinting[index]).timeStamp) * 1000
    ).toLocaleString("de-DE"),
    ADDRESS: "0x" + (await transMinting[index].topics[1]).substr(-40),
  };
  return json;
}

async function getLogs_transfer() {
  const transMinting = (
    await axios.get(
      "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=17107829&toBlock=%22latest%22&address=0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3&topic0=0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62&apikey=MPENGZWJ5EVWFGKIB4WDEG6NX2YNH8XINQ"
    )
  ).data.result;
  const id = await getTokenId(assetipfs).then((id) =>
    (
      "000000000000000000000000000000000000000000000000000000000000000000" +
      id.toString(16)
    ).substr(-64)
  );
  let index;
  let json = [];
  const transTransfer = transMinting.filter(
    (asset) => asset?.topics[1] === asset?.topics[2]
  );
  for (let i in transTransfer) {
    index =
      transTransfer[i].data.substr(-128).substr(0, 64) === id
        ? json.push({
            FROM: "0x" + (await transTransfer[i].topics[2]).substr(-40),
            TO: "0x" + (await transTransfer[i].topics[3]).substr(-40),
            DATE: new Date(
              parseInt(await (await transTransfer[i]).timeStamp) * 1000
            ).toLocaleString("de-DE"),
          })
        : index;
  }
  return json;
}

function timelineGetter(item, x, fromtodate) {
  try {
    if (fromtodate === "FROM") {
      return item[x].FROM;
    } else if (fromtodate === "TO") {
      return item[x].TO;
    } else if (fromtodate === "DATE") {
      return item[x].DATE;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

function Asset() {
  const [asset, setAsset] = useState({
    image: String,
    version: String,
    herkunft: {
      erzeuger: {
        name: String,
        plz: String,
        ortsname: String,
        strasse: String,
      },
      frucht: String,
      sorte: String,
      anbaujahr: String,
      erntedatum: String,
      feldstueck: {
        name: String,
        schlag: {
          name: String,
          flaeche: {
            groesse: String,
            koordinaten: [],
          },
          geopunkte: [],
        },
      },
      massnahmen: {
        pflanzenschutz: [],
        duengung: [],
        pflege: [],
        bonitur: [],
      },
    },
  });
  const [ipfsID, setIpfsID] = useState("");
  const [coor, setCoor] = useState(center);
  const [cevent, setCevent] = useState();
  const [ceventTrans, setCeventTrans] = useState();
  const [details, setDetails] = useState(false);
  const [details2, setDetails2] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function getAsset() {
      const node = create({
        host: "magentadao-backend.westeurope.cloudapp.azure.com",
        port: 443,
        protocol: "https",
      });

      const url = window.location.href;
      assetipfs = url.split("Qm")[1];
      if (typeof assetipfs == "undefined") {
        assetipfs = "bafybei" + url.split("bafybei")[1];
      } else {
        assetipfs = "Qm" + url.split("Qm")[1];
      }

      if (assetipfs === "bafybeiundefined") {
        window.location.assign("/#/error");
      } else {
        const source = node.cat(assetipfs);
        const data = [];
        for await (const chunk of source) {
          data.push(chunk);
        }
        const byteArray = data.toString().split(",");
        var json = "";
        for (var i = 0; i < byteArray.length; i++) {
          json += String.fromCharCode(byteArray[i]);
        }
        return json;
      }
    }

    getAsset().then((data) => {
      setAsset(JSON.parse(data));
      getTokenId(assetipfs).then((id) => setIpfsID(id));
      getLogs_mint().then((d) => setCevent(d));
      getLogs_transfer().then((d) => {
        setCeventTrans(d);
      });
    });
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAmUbo21ZfCE1QcfJNzk7KjFDh9YqnzPnI",
    mapIds: ["b141e05ff6502e26"],
    disableDefaultUI: true,
    zoomControl: false,
  });

  function switchMarker(x) {
    switch (timelineGetter(ceventTrans, x, "TO")) {
      case "0xb34f9785e71b3903389a880c175e9c912520c1c6":
        setCoor({
          lat: 51.08280350388283,
          lng: 13.729460321078426,
        });
        break;
      case "0x5cdac4e0b792199efb8fb2c57a8aa2a9c0476bc3":
        setCoor({
          lat: 51.08280350388283,
          lng: 13.729460321078426,
        });
        break;
      case "0x1373691a3f064d08fbabaf2b0113742b8f33ae2d":
        setCoor({
          lat: 51.08280350388283,
          lng: 12.859687954790482,
        });
        break;
      case "0xc9996ea457593c72acc954b925d8d8a2412c17ba":
        setCoor({
          lat: 51.241388256357354,
          lng: 12.728419200084282,
        });
        break;
      case "0x241364adb31e50fd48d3e807c353e7dee1723e02":
        setCoor({
          lat: 51.1012085165909,
          lng: 13.13361477867345,
        });
        break;
      case "0x769b2c0a6f8166af4667fabdee40ccf223f3424c":
        setCoor({
          lat: 51.20951560450616,
          lng: 12.857736428366156,
        });
        break;
      case "0xf01ebdde8716f00f727f0e3faad914eb2c2ea2ca":
        setCoor({
          lat: parseFloat(
            asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 51.243478
              : asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[0]
          ),
          lng: parseFloat(
            asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 12.731876
              : asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[1]
          ),
        });
        break;
      case "0x7718f3ac1b62781d8f0d9ba837156621120cc24b":
        window.open(
          "/#/asset/QmNod7RVNTVJbMCzc43HypWkeLunhQ19zpAkSM2x8oo9MM/255"
        );
        break;
      case "0x844ba3482cfb70054b6102695df3555e75388236":
        setCoor({
          lat: parseFloat(
            asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 51.08280350388283
              : asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[0]
          ),
          lng: parseFloat(
            asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 13.729460321078426
              : asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[1]
          ),
        });
        break;
      case "0x3aa67fdb51a9fd94d49b8772461491e1462d2645":
        setCoor({
          lat: 48.70794,
          lng: 9.14386,
        });
        break;
      case "0x7de8b8c1fd627b248c6f766aa183d9943c8ee6ba":
        setCoor({
          lat: 48.778454,
          lng: 9.23322,
        });
        break;
      default:
        setCoor({
          lat: parseFloat(
            asset.herkunft.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 51.08280350388283
              : (asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[0])
          ),
          lng: parseFloat(
            asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten === undefined
              ? 13.729460321078426
              : asset?.herkunft?.feldstueck?.schlag.flaeche.koordinaten[0].replace(","," ").split(
                  " "
                )[1]
          ),
        });
        break;
    }
  }
  return isLoaded && asset !== "" && cevent ? (
    <>
      <div id="messageStripe" className="MessageStripe">
        <MessageStrip
          design="Positive"
          hideCloseButton="true"
          className="onlyT"
        >
          {t("verified")}
        </MessageStrip>
      </div>
      <div id="asset" className="Asset">
        <Card
          className="onlyT AssetCard"
          header={
            <AnalyticalCardHeader
              className="onlyT"
              arrowIndicator="Down"
              counter={
                asset?.herkunft === undefined
                  ? "Produktion: 08.2021"
                  : asset?.herkunft?.anbaujahr
              }
              counterState="Success"
              description={
                asset?.herkunft?.frucht === "Bremsscheibe" ||
                asset?.herkunft?.frucht === "Bremssattel" ||
                asset?.herkunft?.frucht === "Bremspedal" ||
                asset?.herkunft?.frucht === "Tank" ||
                asset?.herkunft?.frucht === "Verbindung" ||
                asset?.herkunft?.frucht === "Tankdeckel" ||
                asset?.herkunft?.frucht === "Bremszylinder" ||
                asset?.herkunft?.frucht === "Controller" ||
                asset?.herkunft?.frucht === "Drucksensor" ||
                asset?.herkunft?.frucht === "Bremssattelhalter"
                  ? ""
                  : t("details")
              }
              indicatorState="Success"
              subtitleText={
                asset?.herkunft === undefined
                  ? "100% Boskop Äpfel"
                  : asset?.herkunft?.erntedatum
              }
              titleText={
                asset?.herkunft?.frucht === "PLM Digital Twin" ? t("break") :
                asset?.herkunft === undefined
                  ? "Remo Apfelsaft"
                  : asset?.herkunft?.sorte + " " + asset?.herkunft?.frucht
              }
              onClick={
                asset?.herkunft?.erzeuger?.name === "T-Systems"
                  ? () => setDetails2(!details2)
                  : asset?.herkunft.frucht === "Apfelsaft"
                  ? () => window.open("/#/asset/QmNod7RVNTVJbMCzc43HypWkeLunhQ19zpAkSM2x8oo9MM/255")
                  : asset?.herkunft?.frucht === "Bremsscheibe" ||
                    asset?.herkunft?.frucht === "Bremssattel" ||
                    asset?.herkunft?.frucht === "Bremspedal" ||
                    asset?.herkunft?.frucht === "Tank" ||
                    asset?.herkunft?.frucht === "Verbindung" ||
                    asset?.herkunft?.frucht === "Tankdeckel" ||
                    asset?.herkunft?.frucht === "Bremszylinder" ||
                    asset?.herkunft?.frucht === "Controller" ||
                    asset?.herkunft?.frucht === "Drucksensor" ||
                    asset?.herkunft?.frucht === "Bremssattelhalter"
                  ? ""
                  : () => setDetails(!details)
              }
            />
          }
        >
          <Card
            className="onlyT AssetCard"
            style={{ display: details2 ? "" : "none" }}
          >
            <div className="Tab">
              {/* <List
                mode="SingleSelect"
                headerText="Stückliste"
                separators="Inner"
              >
                <StandardListItem
                  additionalText="Detail"
                  additionalTextState="Information"
                  icon="chain-link"
                >
                  Test
                </StandardListItem>
                <StandardListItem icon="chain-link">Test</StandardListItem>
                <StandardListItem icon="chain-link">Test</StandardListItem>
              </List> */}

              <TableRow>
                <TableCell>{t("list")}:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {asset?.herkunft?.feldstueck?.schlag.geopunkte === undefined
                    ? [].map((obj) => {
                        return obj;
                      })
                    : asset?.herkunft?.feldstueck?.schlag.geopunkte.map(
                        (obj, index) => {
                          return index <= 2 ? (
                            ""
                          ) : (
                            <TableRow>
                              <TableCell>
                                {asset?.herkunft?.feldstueck?.schlag.geopunkte ===
                                undefined
                                  ? ""
                                  : obj.art}
                              </TableCell>
                              <TableCell>
                                {asset?.herkunft?.feldstueck?.schlag.geopunkte ===
                                undefined ? (
                                  ""
                                ) : (
                                  <a
                                    href={
                                      "https://tdao.t-systems.net/#/asset/" +
                                      obj.koordinate
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {" "}
                                   {t("link")} 🔗
                                  </a>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}{" "}
                </TableCell>
              </TableRow>
            </div>
          </Card>

          <Card
            className="onlyT AssetCard"
            style={{ display: details ? "" : "none" }}
          >
            <div className="Tab">
              <TableRow>
                <TableCell>{t("field")} ------------------</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("fieldname")}:</TableCell>
                <TableCell>
                  {asset?.herkunft?.massnahmen === undefined
                    ? ""
                    : asset?.herkunft?.massnahmen?.pflanzenschutz[1] === undefined
                    ? ""
                    : asset?.herkunft?.feldstueck?.name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("schlag")}:</TableCell>
                <TableCell>
                  {asset?.herkunft?.massnahmen === undefined
                    ? ""
                    : asset?.herkunft?.massnahmen?.pflanzenschutz[1] === undefined
                    ? ""
                    : asset?.herkunft?.feldstueck?.schlag.name +
                      " (" +
                      asset?.herkunft?.feldstueck?.schlag.flaeche.groesse +
                      ")"}
                </TableCell>
              </TableRow>
            </div>
          </Card>
          <Card
            className="onlyT AssetCard"
            style={{ display: details ? "" : "none" }}
          >
            <div className="Tab">
              <TableRow>
                <TableCell>{t("plantpro")} -----------</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {asset?.herkunft?.massnahmen === undefined
                ? [].map((obj) => {
                    return obj;
                  })
                : asset?.herkunft?.massnahmen?.pflanzenschutz.map((obj) => {
                    return (
                      <TableRow>
                        <TableCell>
                          {asset?.herkunft?.massnahmen === undefined
                            ? "Produktion: 2021"
                            : obj.datum}
                        </TableCell>
                        <TableCell>
                          {asset?.herkunft?.massnahmen === undefined
                            ? "Produktion: 2021"
                            : obj.mittel + " (" + obj.menge + ")"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </div>
          </Card>
          <Card
            className="onlyT AssetCard"
            style={{ display: details ? "" : "none" }}
          >
            <div className="Tab">
              <TableRow>
                <TableCell>{t("fert")} -------------------</TableCell>
                <TableCell></TableCell>
              </TableRow>

              {asset?.herkunft?.massnahmen === undefined ? (
                <div></div>
              ) : (
                asset?.herkunft?.massnahmen?.duengung.map((obj) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.datum}
                      </TableCell>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.mittel + " (" + obj.menge + ")"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </div>
          </Card>
          <Card
            className="onlyT AssetCard"
            style={{ display: details ? "" : "none" }}
          >
            <div className="Tab">
              <TableRow>
                <TableCell>Pflege ----------------------</TableCell>
                <TableCell></TableCell>
              </TableRow>

              {asset?.herkunft?.massnahmen === undefined ? (
                <div></div>
              ) : (
                asset?.herkunft?.massnahmen?.pflege.map((obj) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.datum}
                      </TableCell>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.verfahren}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </div>
          </Card>
          <Card
            className="onlyT AssetCard"
            style={{ display: details ? "" : "none" }}
          >
            <div className="Tab">
              <TableRow>
                <TableCell>{t("boni")} ---------------------</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {asset?.herkunft?.massnahmen === undefined ? (
                <div></div>
              ) : (
                asset?.herkunft?.massnahmen?.bonitur.map((obj) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.datum}
                      </TableCell>
                      <TableCell>
                        {asset?.herkunft?.massnahmen === undefined
                          ? t("prod") + ": 2021"
                          : obj.kategorie + ": " + obj.bezeichnung}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </div>
          </Card>
          <div>
            <Carousel>
              {asset?.image !== undefined ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  alt={asset?.image}
                  src={`data:image/jpg;base64,${asset?.image}`}
                  width="100%"
                  height="100%"
                />
              ) : asset?.herkunft === undefined ? (
                <div></div>
              ) : (
                asset?.herkunft?.feldstueck?.schlag.geopunkte.map((obj) => {
                  return (obj.art === "Bremsscheibe" ||
                    obj.art === "Bremssattel" ||
                    obj.art === "Halter" ||
                    obj.art === "Sensor" ||
                    obj.art === "Controller" ||
                    obj.art === "Bremzylinder" ||
                    obj.art === "Tankdeckel" ||
                    obj.art === "Tank" ||
                    obj.art === "Verbindung" ||
                    obj.art === "Bremspedal") &&
                    obj.bild === "" ? (
                    ""
                  ) : (
                    <img
                      key={obj.art}
                      alt={obj.art}
                      src={`data:image/jpg;base64,${obj.bild}`}
                      height="280vh"
                    />
                  );
                })
              )}
            </Carousel>
          </div>
        </Card>
        {/* <Title>Blockchain Transaktionen</Title> */}
        <Card className="TransactionCard">
          <CardHeader titleText={t("trans")}/>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coor}
            onLoad={() => switchMarker("default")}
            zoom={15}
            mapTypeId="roadmap"
            options={{
              disableDefaultUI: true,             
            }}
          >
            <Marker
              icon={{
                fillColor: "#e20074",
                fillOpacity: 0.9,
                scale: 0.3,
                strokeColor: "black",
                strokeWeight: 1,
              }}
              position={coor}
              animation="DROP"
            />
          </GoogleMap>

          <br />

          <Timeline className="onlyT TimeLine" slot="" tooltip="">
            {/*
    <TimelineItem
      className='onlyT'
      icon='create'
      titleText='Ware wurde erstellt'
      subtitleText={cevent.DATE}
    >
      Erstellt von{" "}
      <a href={"https://polygonscan.com/address/" + cevent.ADDRESS}>
        {addrMapping[cevent.ADDRESS]}
      </a>
    </TimelineItem>
*/}
<TimelineItem
              icon="approvals"
              onClick={() => switchMarker(6)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 6, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 6, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 6, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 6, "FROM")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 6, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 6, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 6, "TO")]}{" "}
              </a>
            </TimelineItem>
            <TimelineItem
              icon="approvals"
              onClick={() => switchMarker(5)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 5, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 5, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 5, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 5, "FROM")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 5, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 5, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 5, "TO")]}{" "}
              </a>
            </TimelineItem>
            <TimelineItem
              icon="approvals"
              onClick={() => switchMarker(4)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 4, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 4, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 4, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 4, "FROM")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 4, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 4, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 4, "TO")]}{" "}
              </a>
            </TimelineItem>
            <TimelineItem
              icon="approvals"
              onClick={() => switchMarker(3)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 3, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 3, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 3, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 3, "FROM")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 3, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 3, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 3, "TO")] === "Burning"
                  ? t("juice")
                  : addrMapping[timelineGetter(ceventTrans, 3, "TO")]}{" "}
              </a>
            </TimelineItem>
            <TimelineItem
              icon="approvals"
              onClick={() => switchMarker(2)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 2, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 2, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 2, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 2, "FROM")
                }
                target="_blank"
                rel="noreferrer"
              >
                {addrMapping[timelineGetter(ceventTrans, 2, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 2, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 2, "TO")]}{" "}
              </a>
            </TimelineItem>

            <TimelineItem
              icon="approvals"
              onClick={() => switchMarker(1)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 1, "TO")] === "Burning"
                  ? t("processed")
                  : t("send")
              }
              subtitleText={timelineGetter(ceventTrans, 1, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 1, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 1, "FROM")
                }
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 1, "FROM")]}{" "}
              </a>
              {" ➔ "}
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 1, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 1, "TO")]}{" "}
              </a>
            </TimelineItem>
           
            <TimelineItem
              icon="create-form"
              onClick={() => switchMarker(0)}
              titleText={
                addrMapping[timelineGetter(ceventTrans, 0, "TO")] === "Burning"
                  ? t("created")
                  : t("created")
              }
              subtitleText={timelineGetter(ceventTrans, 0, "DATE")}
              style={{
                display: timelineGetter(ceventTrans, 0, "FROM") ? "" : "none",
              }}
            >
              <a
                href={
                  "https://polygonscan.com/address/" +
                  timelineGetter(ceventTrans, 0, "TO")
                }
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                {addrMapping[timelineGetter(ceventTrans, 0, "TO")]}{" "}
              </a>
            </TimelineItem>

           
            
           
            
          </Timeline>
        </Card>
        {/* <text className="Text">War das hilfreich?</text>
        <br />
        <a href="mailto:flueffe@t-systems.com?subject=Positives Feedback">
          <img
            alt="upvote"
            mdxtype="img"
            originaltype="img"
            src="../tu.png"
            width="50px"
            height="50px"
          />{" "}
        </a>
        <a href="mailto:flueffe@t-systems.com?subject=Verbesserungsideen">
          <img
            alt="downvote"
            mdxtype="img"
            originaltype="img"
            src="../td.png"
            width="50px"
            height="50px"
          />{" "}
        </a> */}
      </div>
      <div id="footer" className="Footer">
        <Grid
          defaultSpan="XL4 L4 M4 S4"
          defaultIndent="XL0 L0 M0 S0"
          position="Center"
        >
          <div className="FooterLinks">
            <a
              href={
                "https://opensea.io/assets/matic/0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3/" +
                ipfsID
              }
              target="_blank"
              rel="noreferrer"
              className="FooterLinks"
            >
              <Icon className="footerLinks-icon" name="action" />
              {t("opensea")}
            </a>
          </div>
          <div className="FooterLinks">
            <a
              href={"https://gateway.pinata.cloud/ipfs/" + assetipfs}
              target="_blank"
              rel="noreferrer"
              className="FooterLinks"
            >
              <Icon className="footerLinks-icon" name="action" />
              {t("ipfs")}
            </a>
          </div>

          <div className="FooterLinks">
            <a
              href="https://polygonscan.com/address/0xe939789E151608D7442E2e6Ff4ea4E2eaf314cF3"
              target="_blank"
              rel="noreferrer"
              className="FooterLinks"
            >
              <Icon className="footerLinks-icon" name="action" />
              {t("polygonscan")}
            </a>
          </div>

          <div className="footerPoweredby" data-layout-span="XL12 L12 M12 S12">
            Powered by
            <img
              id="tsystemslogo"
              alt="T-Systems Logo"
              src="../tsystemslogo.svg"
            />
          </div>

          {/* Share on Area */}
          <div
            className="footerShare-title"
            data-layout-span="XL12 L12 M12 S12"
          >
            Share on
          </div>
          <div className="footerShare" data-layout-span="XL12 L12 M12 S12">
            <FacebookShareButton
              className="shareButton"
              url={"https://tdao.t-systems.net/"}
              quote={"tDAO - Blockchain Technology"}
              hashtag="#blockchain"
            >
              <FacebookIcon size={36} />
            </FacebookShareButton>

            {/* <LinkedinShareButton
              title="tDAO"
              summary="tDAO - Blockchain Technology by T-Systems"
              source="https://tdao.t-systems.net/"
              className="shareButton"
            >
              <LinkedinIcon size={36} />
            </LinkedinShareButton> */}

            {/* <TwitterShareButton
              title="tDAO"
              via="tDAO-App"
              hashtags={["tDao", "tsystems"]}
              className="shareButton"
            >
              <TwitterIcon size={36} />
            </TwitterShareButton> */}

            {/* <WhatsappShareButton
              title="tDAO - Blockchain Technology by T-Systems"
              className="shareButton"
            >
              <WhatsappIcon size={36} />
            </WhatsappShareButton> */}

            <EmailShareButton
              subject="Check out tDAO - Blockchain Technology"
              body="Test"
              separator=""
              className="shareButton"
            >
              <EmailIcon size={36} />
            </EmailShareButton>
          </div>
        </Grid>
      </div>
    </>
  ) : (
    <div className="Loading">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Loader
        type="Grid"
        color="#e20074"
        height={100}
        width={100}
        timeout={80000}
      />
    </div>
  );
}

export default Asset;
