import * as Asset from "../Asset";

const [details, setDetails] = useState(false);
const [details2, setDetails2] = useState(false);

<Asset.Card
  className="onlyT Asset.assetCard"
  header={
    <Asset.AnalyticalCardHeader
      className="onlyT"
      arrowIndicator="Down"
      counter={
        Asset.asset.herkunft === undefined
          ? "Produktion: 08.2021"
          : Asset.asset.herkunft?.anbaujahr
      }
      counterState="Success"
      description={
        Asset.asset.herkunft?.frucht === "Bremsscheibe" ||
        Asset.asset.herkunft?.frucht === "Bremssattel" ||
        Asset.asset.herkunft?.frucht === "Bremspedal" ||
        Asset.asset.herkunft?.frucht === "Tank" ||
        Asset.asset.herkunft?.frucht === "Verbindung" ||
        Asset.asset.herkunft?.frucht === "Tankdeckel" ||
        Asset.asset.herkunft?.frucht === "Bremszylinder" ||
        Asset.asset.herkunft?.frucht === "Controller" ||
        Asset.asset.herkunft?.frucht === "Drucksensor" ||
        Asset.asset.herkunft?.frucht === "Bremssattelhalter"
          ? ""
          : "Klicken für weitere Details"
      }
      indicatorState="Success"
      subtitleText={
        Asset.asset.herkunft === undefined
          ? "100% Boskop Äpfel"
          : Asset.asset.herkunft?.erntedatum
      }
      titleText={
        Asset.asset.herkunft === undefined
          ? "Apfeldirektsaft (Naturtrüb)"
          : Asset.asset.herkunft?.sorte + " " + Asset.asset.herkunft?.frucht
      }
      onClick={
        Asset.asset.herkunft?.erzeuger.name === "T-Systems"
          ? () => setDetails2(!details2)
          : Asset.asset.herkunft === undefined
          ? () => window.open("/#/Asset.asset/" + Asset.asset.zutaten[0].id)
          : Asset.asset.herkunft?.frucht === "Bremsscheibe" ||
            Asset.asset.herkunft?.frucht === "Bremssattel" ||
            Asset.asset.herkunft?.frucht === "Bremspedal" ||
            Asset.asset.herkunft?.frucht === "Tank" ||
            Asset.asset.herkunft?.frucht === "Verbindung" ||
            Asset.asset.herkunft?.frucht === "Tankdeckel" ||
            Asset.asset.herkunft?.frucht === "Bremszylinder" ||
            Asset.asset.herkunft?.frucht === "Controller" ||
            Asset.asset.herkunft?.frucht === "Drucksensor" ||
            Asset.asset.herkunft?.frucht === "Bremssattelhalter"
          ? ""
          : () => setDetails(!details)
      }
    />
  }
>
  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details2 ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Stückliste:</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>
      <Asset.TableRow>
        <Asset.TableCell>
          {Asset.asset.herkunft?.feldstueck.schlag.geopunkte === undefined
            ? [].map((obj) => {
                return obj;
              })
            : Asset.asset.herkunft?.feldstueck.schlag.geopunkte.map(
                (obj, index) => {
                  return index <= 2 ? (
                    ""
                  ) : (
                    <Asset.TableRow>
                      <Asset.TableCell>
                        {Asset.asset.herkunft?.feldstueck.schlag.geopunkte ===
                        undefined
                          ? ""
                          : obj.art}
                      </Asset.TableCell>
                      <Asset.TableCell>
                        {Asset.asset.herkunft?.feldstueck.schlag.geopunkte ===
                        undefined ? (
                          ""
                        ) : (
                          <Asset.a
                            href={
                              "https://tdao.t-systems.net/#/Asset.asset/" +
                              obj.koordinate
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {" "}
                            Link 🔗
                          </Asset.a>
                        )}
                      </Asset.TableCell>
                    </Asset.TableRow>
                  );
                }
              )}{" "}
        </Asset.TableCell>
      </Asset.TableRow>
    </Asset.div>
  </Asset.Card>

  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Felddaten ------------------</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>
      <Asset.TableRow>
        <Asset.TableCell>Feldstückname:</Asset.TableCell>
        <Asset.TableCell>
          {Asset.asset.herkunft?.massnahmen === undefined
            ? ""
            : Asset.asset.herkunft?.massnahmen.pflanzenschutz[1] === undefined
            ? ""
            : Asset.asset.herkunft?.feldstueck.name}
        </Asset.TableCell>
      </Asset.TableRow>

      <Asset.TableRow>
        <Asset.TableCell>Schlag:</Asset.TableCell>
        <Asset.TableCell>
          {Asset.asset.herkunft?.massnahmen === undefined
            ? ""
            : Asset.asset.herkunft?.massnahmen.pflanzenschutz[1] === undefined
            ? ""
            : Asset.asset.herkunft?.feldstueck.schlag.name +
              " (" +
              Asset.asset.herkunft?.feldstueck.schlag.flaeche.groesse +
              ")"}
        </Asset.TableCell>
      </Asset.TableRow>
    </Asset.div>
  </Asset.Card>
  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Pflanzenschutz -----------</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>
      {Asset.asset.herkunft?.massnahmen === undefined
        ? [].map((obj) => {
            return obj;
          })
        : Asset.asset.herkunft?.massnahmen.pflanzenschutz.map((obj) => {
            return (
              <Asset.TableRow>
                <Asset.TableCell>
                  {Asset.asset.herkunft?.massnahmen === undefined
                    ? "Produktion: 2021"
                    : obj.datum}
                </Asset.TableCell>
                <Asset.TableCell>
                  {Asset.asset.herkunft?.massnahmen === undefined
                    ? "Produktion: 2021"
                    : obj.mittel + " (" + obj.menge + ")"}
                </Asset.TableCell>
              </Asset.TableRow>
            );
          })}
    </Asset.div>
  </Asset.Card>
  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Düngung -------------------</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>

      {Asset.asset.herkunft?.massnahmen === undefined ? (
        <Asset.div></Asset.div>
      ) : (
        Asset.asset.herkunft?.massnahmen.duengung.map((obj) => {
          return (
            <Asset.TableRow>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.datum}
              </Asset.TableCell>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.mittel + " (" + obj.menge + ")"}
              </Asset.TableCell>
            </Asset.TableRow>
          );
        })
      )}
    </Asset.div>
  </Asset.Card>
  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Pflege ----------------------</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>

      {Asset.asset.herkunft?.massnahmen === undefined ? (
        <Asset.div></Asset.div>
      ) : (
        Asset.asset.herkunft?.massnahmen.pflege.map((obj) => {
          return (
            <Asset.TableRow>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.datum}
              </Asset.TableCell>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.verfahren}
              </Asset.TableCell>
            </Asset.TableRow>
          );
        })
      )}
    </Asset.div>
  </Asset.Card>
  <Asset.Card
    className="onlyT Asset.assetCard"
    style={{ display: details ? "" : "none" }}
  >
    <Asset.div className="Tab">
      <Asset.TableRow>
        <Asset.TableCell>Bonitur ---------------------</Asset.TableCell>
        <Asset.TableCell></Asset.TableCell>
      </Asset.TableRow>
      {Asset.asset.herkunft?.massnahmen === undefined ? (
        <Asset.div></Asset.div>
      ) : (
        Asset.asset.herkunft?.massnahmen.bonitur.map((obj) => {
          return (
            <Asset.TableRow>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.datum}
              </Asset.TableCell>
              <Asset.TableCell>
                {Asset.asset.herkunft?.massnahmen === undefined
                  ? "Produktion: 2021"
                  : obj.kategorie + ": " + obj.bezeichnung}
              </Asset.TableCell>
            </Asset.TableRow>
          );
        })
      )}
    </Asset.div>
  </Asset.Card>
  <Asset.div>
    <Asset.Carousel>
      {Asset.asset.image !== undefined ? (
        <Asset.img
          alt={Asset.asset.image}
          src={`data:image/jpg;base64,${Asset.asset.image}`}
          width="100%"
          height="100%"
        />
      ) : Asset.asset.herkunft === undefined ? (
        <Asset.div></Asset.div>
      ) : (
        Asset.asset.herkunft?.feldstueck.schlag.geopunkte.map((obj) => {
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
            <Asset.img
              key={obj.art}
              alt={obj.art}
              src={`data:image/jpg;base64,${obj.bild}`}
              height="280vh"
            />
          );
        })
      )}
    </Asset.Carousel>
  </Asset.div>
</Asset.Card>;
