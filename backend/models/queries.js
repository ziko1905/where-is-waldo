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

async function createPlayer(name, time, sid) {
  await client.player.create({
    data: {
      name: name,
      timeMS: time,
      sid: sid,
    },
  });
}

async function getPlayerBySID(sid) {
  return await client.player.findFirst({
    where: {
      sid: sid,
    },
  });
}

module.exports = {
  getDefaultCharsNames,
  getCharacters,
  getPositionData,
  getLeaderboard,
  createPlayer,
  getPlayerBySID,
};
