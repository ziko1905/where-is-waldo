const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const characters = [
  {
    name: "Waldo",
    positionL: 60.5,
    positionT: 34.1,
    widthPer: 2.6,
    heightPer: 6.1,
  },
  {
    name: "Wizard",
    positionL: 25.6,
    positionT: 31.4,
    widthPer: 2.6,
    heightPer: 6.1,
  },
  {
    name: "Odlaw",
    positionL: 10.2,
    positionT: 32.6,
    widthPer: 1.3,
    heightPer: 4.1,
  },
];

const players = [
  // sids are random, created manually, only to prevent duplicates
  {
    name: "Default Player 1",
    timeMS: 1000000,
    sid: "8aaa55ea-ac55-42e2-98a6-37e341baeeb5",
  },
  {
    name: "Default Player 2",
    timeMS: 905300,
    sid: "63e7e450-5c5a-4154-9be5-702c2df3c095",
  },
  {
    name: "Default Player 3",
    timeMS: 1023010,
    sid: "c290ec6b-8256-4554-ba4d-14ee7b70ead6",
  },
  {
    name: "Default Player 4",
    timeMS: 12311121,
    sid: "cb11c11d-ce74-4d74-b837-e2fa4f2296e8",
  },
];

async function main() {
  const promises = [];

  for (const char of characters) {
    promises.push(
      client.character.upsert({
        where: {
          name: char.name,
        },
        update: {},
        create: {
          ...char,
        },
      })
    );
  }

  if (process.env.MODE == "development") {
    for (const ply of players) {
      promises.push(
        client.player.upsert({
          where: { sid: ply.sid },
          update: {},
          create: { ...ply },
        })
      );
    }
  }

  await Promise.all(promises);
}

main()
  .then(async () => await client.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await client.$disconnect();
    process.exit(1);
  });
