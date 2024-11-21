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

async function main() {
  for (char of characters) {
    await client.character.upsert({
      where: {
        name: char.name,
      },
      update: {},
      create: {
        ...char,
      },
    });
  }
}

main()
  .then(async () => await client.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await client.$disconnect();
    process.exit(1);
  });
