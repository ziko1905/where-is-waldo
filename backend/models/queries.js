const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

async function getDefaultCharsNames() {
  return await client.character.findMany({
    select: {
      name: true,
    },
  });
}

async function getCharacters() {
  return await client.character.findMany({});
}

async function getPositionData(charName) {
  const data = await client.character.findFirst({
    where: {
      name: charName,
    },
  });
  return [data.positionL, data.positionT, data.widthPer, data.heightPer];
}

async function getLeaderboard(size) {
  return await client.player.findMany({
    take: size,
    orderBy: [
      {
        timeMS: "asc",
      },
      {
        name: "desc",
      },
    ],
  });
}

async function updateSessionTime(sessionID, time) {
  await client.session.update({
    where: {
      sid: sessionID,
    },
    data: {
      time: time,
    },
  });
}

async function createPlayer(name, time) {
  await client.player.create({
    data: {
      name: name,
      timeMS: time,
    },
  });
}

async function getSessionTime(sessionID) {
  const data = await client.session.findFirst({
    where: { sid: sessionID },
    select: {
      time: true,
    },
  });

  return data.time;
}

module.exports = {
  getDefaultCharsNames,
  getCharacters,
  getPositionData,
  getLeaderboard,
  updateSessionTime,
  createPlayer,
  getSessionTime,
};
