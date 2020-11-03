import champion from "./champion";
import summonerSpells from "./summonerSpells";

const iconPath = "/rank_icons";

export const iconRankMap = {
  IRON: `${iconPath}/Emblem_Iron.png`,
  BRONZE: `${iconPath}/Emblem_Bronze.png`,
  SILVER: `${iconPath}/Emblem_Silver.png`,
  GOLD: `${iconPath}/Emblem_Gold.png`,
  PLATINUM: `${iconPath}/Emblem_Platinum.png`,
  DIAMOND: `${iconPath}/Emblem_Diamond.png`,
  MASTER: `${iconPath}/Emblem_Master.png`,
  CHALLENGER: `${iconPath}/Emblem_Challenger.png`,
};

export function championIdMapping() {
  let championIdMap = {};
  Object.keys(champion["data"]).forEach((el) => {
    let temp = champion["data"][el];
    championIdMap[temp["key"]] = {
      name: temp["name"],
      image: temp["image"]["full"],
    };
  });

  return championIdMap;
}

export function summonerSpellsIdMapping() {
  let summonerSpellsIdMap = {};
  Object.keys(summonerSpells["data"]).forEach((el) => {
    let temp = summonerSpells["data"][el];
    summonerSpellsIdMap[temp["key"]] = {
      id: temp["id"],
      name: temp["name"],
      image: temp["image"]["full"],
      description: temp["description"],
    };
  });

  return summonerSpellsIdMap;
}

export function extractMatchDetail(data, accountId) {
  let participantId = null;
  for (const participant of data["participantIdentities"]) {
    if (participant["player"]["accountId"] === accountId) {
      participantId = Number(participant["participantId"]);
      break;
    }
  }
  let summonerSpellsIdMap = summonerSpellsIdMapping();
  let championIdMap = championIdMapping();

  const matchDetail = {
    queueId: data["queueId"],
    outcome: data["participants"][participantId - 1]["stats"]["win"],
    teamId: data["participants"][participantId - 1]["teamId"],
    gameCreation: data["gameCreation"],
    gameDuration: data["gameDuration"],
    user: {
      champion: championIdMap[data["participants"][participantId - 1]["championId"]],
      spell1Id: summonerSpellsIdMap[data["participants"][participantId - 1]["spell1Id"]],
      spell2Id: summonerSpellsIdMap[data["participants"][participantId - 1]["spell2Id"]],
      kills: data["participants"][participantId - 1]["stats"]["kills"],
      deaths: data["participants"][participantId - 1]["stats"]["deaths"],
      assists: data["participants"][participantId - 1]["stats"]["assists"],
      champLevel: data["participants"][participantId - 1]["stats"]["champLevel"],
      totalMinionsKilled: data["participants"][participantId - 1]["stats"]["totalMinionsKilled"] + data["participants"][participantId - 1]["stats"]["neutralMinionsKilled"],
      items: [
        data["participants"][participantId - 1]["stats"]["item0"],
        data["participants"][participantId - 1]["stats"]["item1"],
        data["participants"][participantId - 1]["stats"]["item2"],
        data["participants"][participantId - 1]["stats"]["item6"],
        data["participants"][participantId - 1]["stats"]["item3"],
        data["participants"][participantId - 1]["stats"]["item4"],
        data["participants"][participantId - 1]["stats"]["item5"],
      ],
    },
  };

  // let outcome = data["participants"][participantId - 1]["stats"]["win"];
  // let teamId = data["participants"][participantId - 1]["teamId"];
  // let championId = data["participants"][participantId - 1]["championId"];
  // let spell1Id = summonerSpellsId[data["participants"][participantId - 1]["spell1Id"]];
  // let spell2Id = summonerSpellsId[data["participants"][participantId - 1]["spell2Id"]];
  // let kills = data["participants"][participantId - 1]["stats"]["kills"];
  // let deaths = data["participants"][participantId - 1]["stats"]["deaths"];
  // let assists = data["participants"][participantId - 1]["stats"]["assists"];

  // let gameCreation = data['gameCreation']
  // let gameDuration = data['gameDuration']
  return matchDetail;
}
