const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

async function getDefaultCharsId() {
  return await client.character.findMany({
    select: {
      id: true,
    },
  });
}

module.exports = {
  getDefaultCharsId,
};
