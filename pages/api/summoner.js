import { championIdMapping, summonerSpellsIdMapping, extractMatchDetail } from "../../src/util";

export default (req, res) => {
  if (req.method == "GET") {
    const userName = req.query.userName;
    const getUserNameUrl = `${process.env.RIOT_BASE_URI}/lol/summoner/v4/summoners/by-name/${userName}`;
    console.log(getUserNameUrl);
    fetch(getUserNameUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("ERROR 404");
        }
        return res.json();
      })
      .then((userData) => {
        console.log(userData, "first level data");
        const userId = userData.id;
        const getOverallStateUrl = `${process.env.RIOT_BASE_URI}/lol/league/v4/entries/by-summoner/${userId}`;

        fetch(getOverallStateUrl, {
          headers: {
            "X-Riot-Token": process.env.RIOT_API_KEY,
          },
        })
          .then((res) => res.json())
          .then(async (rankData) => {
            console.log(rankData, "2nd level data");
            let reqData = {};
            reqData["userData"] = {
              name: userData["name"],
              profileIcon: `http://ddragon.leagueoflegends.com/cdn/10.22.1/img/profileicon/${userData["profileIconId"]}.png`,
              summonerLevel: userData["summonerLevel"],
              revisionDate: userData["revisionDate"],
            };
            reqData["RANKED_SOLO_5x5"] = {};
            reqData["RANKED_FLEX_SR"] = {};
            rankData.forEach((el) => {
              let queue = el["queueType"];
              reqData[queue] = el;
            });
            // console.log(reqData, "reqdata");

            reqData["matchHistory"] = await getUserMatchHistory(userData["accountId"]);
            res.status(200).json({ data: reqData });
          })
          .catch((err) => res.status(404).json({ message: err }));
      })
      .catch((err) => res.status(404).json({ message: "summoner not found" }));
  }
};

async function getUserMatchHistory(accountId) {
  const getUserMatchHistoryUrl = `${process.env.RIOT_BASE_URI}/lol/match/v4/matchlists/by-account/${accountId}?queue=420&endIndex=10&beginIndex=0`;

  const res = await fetch(getUserMatchHistoryUrl, {
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  });

  const data = await res.json();

  console.log(data["matches"], "sup?");

  let newData = [];

  const championIdMap = championIdMapping();

  async function getMatchDetail(el) {
    let getMatchDetailUrl = `${process.env.RIOT_BASE_URI}/lol/match/v4/matches/${el.gameId}`;
    let res = await fetch(getMatchDetailUrl, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    });

    return await res.json();
  }

  for (const match of data["matches"]) {
    let temp = {};
    temp["champion"] = championIdMap[match["champion"]];
    temp["queue"] = match["queue"];
    temp["lane"] = match["lane"];
    temp["timestamp"] = match["timestamp"];

    newData.push(temp);
  }

  let matchDetail = await Promise.all(data["matches"].map(getMatchDetail));

  let overallData = {
    matchData: newData,
    matchDetail: matchDetail.map((el) => extractMatchDetail(el, accountId)),
  };

  // console.log(newData, "hello??");

  return overallData;
}
