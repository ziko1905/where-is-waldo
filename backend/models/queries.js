const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

async function getDefaultCharsNames() {
  return await client.character.findMany({
    select: {
      name: true,
    },
  });
}

module.exports = {
  getDefaultCharsNames,
};
