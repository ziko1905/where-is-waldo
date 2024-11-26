/* eslint-disable no-undef */
const prisma = require("../client");
const request = require("supertest");
const express = require("express");
const app = express();
const leaderboardRouter = require("./leaderboardRouter");
const isAscending = require("../utils/isAscending");
const initSessionRound = require("../config/round");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const convertSID = require("../utils/convertSID");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const prismaSesStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
    store: prismaSesStore,
  })
);

app.use(initSessionRound);

app.use("/leaderboard", leaderboardRouter);

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send("Internal Server Error");
});

const times = [25000, 30000, 34000, 12000, 15000, 45000, 31000, 25000];

const playersInit = async () => {
  const createPlayers = [];

  for (let i = 0; i < times.length; i++) {
    createPlayers.push(
      prisma.player.create({ data: { name: `Player ${i}`, timeMS: times[i] } })
    );
  }

  await prisma.$transaction(createPlayers);
};

const resetDefaultPlayers = async () => {
  await prisma.player.deleteMany();
  await playersInit();
};

beforeAll(async () => {
  await playersInit();
});

afterAll(async () => {
  const deletedPlayers = prisma.player.deleteMany();
  const deletedSessions = prisma.session.deleteMany();

  await prisma.$transaction([deletedSessions, deletedPlayers]);

  await prismaSesStore.shutdown();
});

describe("/leaderboard", () => {
  it("load first 7 players on get by default", async () => {
    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(7);
      });
  });
  it("load first 6 players on get", async () => {
    return request(app)
      .get("/leaderboard?size=6")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(6);
      });
  });

  it("load all players that are in db (on default size)", async () => {
    for (let i = 0; i < times.length - 3; i++) {
      const ply = await prisma.player.findFirst();

      await prisma.player.delete({ where: { ...ply } });
    }

    const response = await request(app).get("/leaderboard").expect(200);
    expect(response.body.length).toBe(3);

    await resetDefaultPlayers();
  });

  it("load players in times ascending order", () => {
    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then((res) => {
        expect(isAscending(res.body, (ply) => ply.timeMS)).toBe(true);
      });
  });

  it("load correct player names with default player order", () => {
    return request(app)
      .get("/leaderboard")
      .expect(200)
      .then(async (res) => {
        expect(isAscending(res.body[0])).toBe(true);
      });
  });

  it("put player in right position (first position)", async () => {
    const agent = request.agent(app);
    // Initializing session
    const responseInit = await agent.get("/");
    const sid = convertSID(responseInit.headers["set-cookie"]);
    const session = await prismaSesStore.get(sid);
    session.time = times.sort()[0] - 100;
    session.hasWon = true;
    await prismaSesStore.set(sid, session);

    const response = await agent
      .post("/leaderboard")
      .send({ name: "Testly Player 1" });

    expect(response.status).toBe(200);

    const responseGet = await agent.get("/leaderboard");

    expect(responseGet.status).toBe(200);
    expect(responseGet.body[0].name).toBe("Testly Player 1");
    expect(responseGet.body[0].timeMS).toBe(times.sort()[0] - 100);

    await resetDefaultPlayers();
  });

  it("put player in right position (third position)", async () => {
    const agent = request.agent(app);
    // Initializing session
    const responseInit = await agent.get("/");
    const sid = convertSID(responseInit.headers["set-cookie"]);
    const session = await prismaSesStore.get(sid);
    session.time = times.sort()[2] - 100;
    session.hasWon = true;
    await prismaSesStore.set(sid, session);

    const response = await agent
      .post("/leaderboard")
      .send({ name: "Testly Player 3" });

    expect(response.status).toBe(200);

    const responseGet = await agent.get("/leaderboard");

    expect(responseGet.status).toBe(200);
    expect(responseGet.body[2].name).toBe("Testly Player 3");
    expect(responseGet.body[2].timeMS).toBe(times.sort()[2] - 100);

    await resetDefaultPlayers();
  });

  it("put player in right position (last position)", async () => {
    const agent = request.agent(app);
    // Initializing session
    const responseInit = await agent.get("/");
    const sid = convertSID(responseInit.headers["set-cookie"]);
    const session = await prismaSesStore.get(sid);
    session.time = times.sort()[6] - 100;
    session.hasWon = true;
    await prismaSesStore.set(sid, session);

    const response = await agent
      .post("/leaderboard")
      .send({ name: "Last Player 3" });

    expect(response.status).toBe(200);

    const responseGet = await agent.get("/leaderboard");

    expect(responseGet.status).toBe(200);
    expect(responseGet.body[6].name).toBe("Last Player 3");
    expect(responseGet.body[6].timeMS).toBe(times.sort()[6] - 100);

    await resetDefaultPlayers();
  });

  it("put player in right position (last position, 6th)", async () => {
    const agent = request.agent(app);
    // Initializing session
    const responseInit = await agent.get("/");
    const sid = convertSID(responseInit.headers["set-cookie"]);
    const session = await prismaSesStore.get(sid);
    session.time = times.sort()[5] - 100;
    session.hasWon = true;
    await prismaSesStore.set(sid, session);

    const response = await agent
      .post("/leaderboard")
      .send({ name: "Last Player 4" });

    expect(response.status).toBe(200);

    const responseGet = await agent.get("/leaderboard?size=6");

    expect(responseGet.status).toBe(200);
    expect(responseGet.body[5].name).toBe("Last Player 4");
    expect(responseGet.body[5].timeMS).toBe(times.sort()[5] - 100);

    await resetDefaultPlayers();
  });

  describe("Invalid requests", () => {
    it("respond with status code of 400 for session that hasn't won", () => {
      const agent = request.agent(app);

      return agent
        .post("/leaderboard")
        .send({ name: "Invalid Player 1" })
        .expect(400);
    });
  });

  it("respond with status code of 400 for session that hasn't got time", async () => {
    const agent = request.agent(app);
    const responseInit = await agent.get("/");
    const sid = convertSID(responseInit.headers["set-cookie"]);
    const session = await prismaSesStore.get(sid);
    session.hasWon = true;
    await prismaSesStore.set(sid, session);

    return agent
      .post("/leaderboard")
      .send({ name: "Invalid Player 1" })
      .expect(400);
  });
});
