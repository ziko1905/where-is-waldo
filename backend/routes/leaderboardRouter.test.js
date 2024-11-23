/* eslint-disable no-undef */
const prisma = require("../client");
const request = require("supertest");
const express = require("express");
const app = express();
const leaderboardRouter = require("./leaderboardRouter");
const isAscending = require("../utils/isAscending");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/leaderboard", leaderboardRouter);

const times = [25000, 30000, 34000, 12000, 15000, 45000, 31000, 25000];

const playersInit = async () => {
  const createPlayers = [];
  for (let i = 0; i < times.length; i++) {
    createPlayers.push(
      prisma.player.create({ data: { name: `Player ${i}`, timeMS: times[i] } })
    );
  }

  await prisma.$transaction([...createPlayers]);
};

const playersReset = async () => {
  deletedPlayers = prisma.player.deleteMany();

  await prisma.$transaction([deletedPlayers]);
};

beforeAll(async () => {
  await playersInit();
});

afterAll(async () => {
  await playersReset();

  await prisma.$disconnect();
});

describe("/leaderboard", () => {
  it("Loads first 7 players on get by default", async () => {
    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(7);
      });
  });
  it("Loads first 6 players on get", async () => {
    return request(app)
      .get("/leaderboard?size=6")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(6);
      });
  });
  it("Loads all players that are in db (on default size)", async () => {
    for (let i = 0; i < times.length - 3; i++) {
      const ply = await prisma.player.findFirst();
      await prisma.player.delete({ where: { ...ply } });
    }

    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(3);
      });
  });

  it("Loads players in times ascending order", () => {
    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then((res) => {
        expect(isAscending(res.body, (ply) => ply.timeMS)).toBe(true);
      });
  });

  // it("Puts player in right position (first position)", () => {
  //   return request(app);
  // });
});
