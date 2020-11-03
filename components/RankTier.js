import Typography from "@material-ui/core/Typography";

// util
import { iconRankMap } from "../src/util";

export default function RankTier({ summonerData }) {
  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Object.keys(summonerData["RANKED_SOLO_5x5"]).length === 0 ? "/rank_icons/unranked.png" : iconRankMap[summonerData["RANKED_SOLO_5x5"]["tier"]]} style={{ width: "100px" }} />
          <div style={{ margin: "0 25px" }}>
            <Typography variant="body1">Ranked Solo</Typography>

            {Object.keys(summonerData["RANKED_SOLO_5x5"]).length !== 0 ? (
              <>
                <Typography variant="h6" color="primary">
                  {summonerData["RANKED_SOLO_5x5"]["tier"]} {summonerData["RANKED_SOLO_5x5"]["rank"]}
                </Typography>
                <Typography variant="body1">
                  {summonerData["RANKED_SOLO_5x5"]["leaguePoints"]} LP / {summonerData["RANKED_SOLO_5x5"]["wins"]} W {summonerData["RANKED_SOLO_5x5"]["losses"]} L
                </Typography>
                <Typography variant="body1">Win Ratio: {Math.round((summonerData["RANKED_SOLO_5x5"]["wins"] / (summonerData["RANKED_SOLO_5x5"]["wins"] + summonerData["RANKED_SOLO_5x5"]["losses"])) * 100)}%</Typography>
              </>
            ) : (
              <Typography variant="body1" style={{ fontWeight: "700" }}>
                Unranked
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Object.keys(summonerData["RANKED_FLEX_SR"]).length === 0 ? "/rank_icons/unranked.png" : iconRankMap[summonerData["RANKED_FLEX_SR"]["tier"]]} style={{ width: "64px", height: "64px", margin: "0 45px 0 15px" }} />
          <div>
            <Typography variant="body2">Flex 5:5 Rank</Typography>

            {Object.keys(summonerData["RANKED_FLEX_SR"]).length !== 0 ? (
              <>
                <Typography variant="body1" color="primary" style={{ fontWeight: "700" }}>
                  {summonerData["RANKED_FLEX_SR"]["tier"]}
                </Typography>
                <Typography variant="body2">
                  {summonerData["RANKED_FLEX_SR"]["leaguePoints"]} LP / {summonerData["RANKED_FLEX_SR"]["wins"]} W {summonerData["RANKED_FLEX_SR"]["losses"]} L
                </Typography>
                <Typography variant="body2">Win Ratio: {Math.round((summonerData["RANKED_FLEX_SR"]["wins"] / (summonerData["RANKED_FLEX_SR"]["wins"] + summonerData["RANKED_FLEX_SR"]["losses"])) * 100)}%</Typography>
              </>
            ) : (
              <Typography variant="body2" style={{ fontWeight: "700" }}>
                Unranked
              </Typography>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
