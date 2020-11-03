import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import moment from "moment";

// Components
import RankTier from "../components/RankTier";

// MUI
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";

export default function Summoner() {
  const router = useRouter();
  const { query } = router;

  const [foundSummoner, setFoundSummoner] = useState(null);
  const [summonerData, setSummonerData] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    if (Object.keys(query).length !== 0) {
      console.log("hello??");
      const userName = query.userName;
      const url = new URL(`/api/summoner?userName=${userName}`, document.baseURI);
      fetch(url.toString())
        .then((res) => {
          if (!res.ok) {
            throw Error;
          }

          return res.json();
        })
        .then((data) => {
          setIsLoading(false);
          console.log(data, "fetch inside");
          setSummonerData(data["data"]);
          setFoundSummoner(true);
        })
        .catch((err) => {
          console.log(err, "error??");
          setIsLoading(false);
          setFoundSummoner(false);
        });
    }
  }, [query]);
  console.log(summonerData, "summonerData");
  const toDisplay = isLoading ? (
    <LinearProgress />
  ) : foundSummoner ? (
    <Container maxWidth="xl" style={{ paddingTop: "20px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <img src={summonerData["userData"]["profileIcon"]} style={{ width: "120px", borderRadius: "20px" }} />
          <Typography variant="body1" align="center" style={{ fontWeight: "700", color: "black" }}>
            LVL {summonerData["userData"]["summonerLevel"]}
          </Typography>
        </div>
        <div style={{ margin: "0 25px", position: "relative" }}>
          <Typography variant="h5">{summonerData["userData"]["name"]}</Typography>
          <Typography variant="body1">
            Ladder Rank <span style={{ color: "#5383E8", fontWeight: "700" }}>232,434</span> (10.68% of top)
          </Typography>
          <div style={{ position: "absolute", bottom: "30px" }}>
            <Typography variant="body1">Last Updated: {moment(summonerData["userData"]["revisionDate"]).fromNow()}</Typography>
          </div>
        </div>
      </div>
      <Grid container style={{ marginTop: "25px" }}>
        <Grid item xs={12} md={3}>
          <RankTier summonerData={summonerData} />
        </Grid>
        <Grid item xs={12} md={9}>
          {summonerData["matchHistory"]["matchDetail"].map((el, index) => (
            <div key={index} style={{ display: "flex", padding: "20px", alignItems: "center", borderLeft: el["outcome"] ? "10px solid #1a78ae" : "10px solid #c6443e", marginBottom: "15px" }}>
              <div>
                <Typography variant="h6" align="center">
                  {el["queueId"] === 420 ? "Ranked Solo" : "Other"}
                </Typography>
                <Typography variant="body1" align="center">
                  {moment(el["gameCreation"]).fromNow()}
                </Typography>
                <hr style={{ backgroundColor: "#A0A0A0", height: "1px", width: "50%", borderRadius: "2px" }} />
                <Typography variant="body1" align="center" style={el["outcome"] ? { color: "#1a78ae", fontWeight: "700" } : { color: "#c6443e", fontWeight: "700" }}>
                  {el["outcome"] ? "Victory" : "Defeat"}
                </Typography>
                <Typography variant="body1" align="center">
                  {moment.utc(el["gameDuration"] * 1000).format("mm[m] ss[s]")}
                </Typography>
              </div>
              <div style={{ margin: "0 25px" }}>
                <img src={`http://ddragon.leagueoflegends.com/cdn/10.22.1/img/champion/${el["user"]["champion"]["image"]}`} style={{ borderRadius: "50px", width: "50px" }} />
                <Typography variant="body1" align="center">
                  {el["user"]["champion"]["name"]}
                </Typography>
                <div>
                  <Tooltip
                    placement="bottom"
                    title={
                      <React.Fragment>
                        <Typography variant="body1" style={{ fontWeight: "700", color: "#FBCE30", fontSize: "1em" }}>
                          {el["user"]["spell1Id"]["name"]}
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: "1em" }}>
                          {el["user"]["spell1Id"]["description"]}
                        </Typography>
                      </React.Fragment>
                    }
                  >
                    <img src={`http://ddragon.leagueoflegends.com/cdn/10.22.1/img/spell/${el["user"]["spell1Id"]["image"]}`} style={{ width: "25px", marginRight: "5px" }} />
                  </Tooltip>

                  <Tooltip
                    placement="bottom"
                    title={
                      <React.Fragment>
                        <Typography variant="body1" style={{ fontWeight: "700", color: "#FBCE30", fontSize: "1em" }}>
                          {el["user"]["spell2Id"]["name"]}
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: "1em" }}>
                          {el["user"]["spell2Id"]["description"]}
                        </Typography>
                      </React.Fragment>
                    }
                  >
                    <img src={`http://ddragon.leagueoflegends.com/cdn/10.22.1/img/spell/${el["user"]["spell2Id"]["image"]}`} style={{ width: "25px" }} />
                  </Tooltip>
                </div>
              </div>
              <div style={{ padding: "0 25px" }}>
                <Typography variant="h6" align="center">
                  {el["user"]["kills"]}/<span style={{ color: "#c6443e" }}>{el["user"]["deaths"]}</span>/{el["user"]["assists"]}
                </Typography>
                <Typography variant="body1" align="center">
                  {((el["user"]["kills"] + el["user"]["assists"]) / el["user"]["deaths"]).toFixed(2)}:1 KDA
                </Typography>
              </div>
              <div>
                <Typography variant="body1" align="center">
                  Level {el["user"]["champLevel"]}
                </Typography>
                <Typography variant="body1" align="center">
                  {el["user"]["totalMinionsKilled"]} ({(el["user"]["totalMinionsKilled"] / (el["gameDuration"] / 60)).toFixed(1)}) CS
                </Typography>
              </div>
              <div style={{ padding: "0 25px" }}>
                <div style={{ display: "table-cell", width: "110px" }}>
                  {el["user"]["items"].map((el, index) =>
                    el !== 0 ? (
                      <div style={{ display: "inline-block" }}>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/10.22.1/img/item/${el}.png`} key={index} style={{ width: "25px", height: "25px", borderRadius: "5px", marginTop: "2px", marginRight: "2px" }} />
                      </div>
                    ) : (
                      <div style={{ display: "inline-block", width: "25px", height: "25px", borderRadius: "5px", marginTop: "2px", marginRight: "2px", backgroundColor: "black", opacity: "0.5" }} />
                    )
                  )}
                </div>
              </div>

              {/* <Typography variant="h6">Champion: {el["champion"]["name"]}</Typography> */}
            </div>
          ))}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Typography>Error</Typography>
  );

  console.log(summonerData);
  return <>{toDisplay}</>;
}
