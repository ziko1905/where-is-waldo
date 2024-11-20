/* eslint no-undef: "off" */
const searchRouter = require("./searchRouter");
const request = require("supertest");
const express = require("express");
const queries = require("../models/queries");
const app = express();
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const initSessionRound = require("../config/round");
const { getNumericProperties } = require("../utils/utils");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(initSessionRound);

app.use("/search", searchRouter);

// Used for logging 500's
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send("Internal Server Error");
});

let defaultBody;
let defaultCharsNames;
const defaultCorrectGuesses = {};

beforeEach(async () => {
  // Needed for reset after each test
  defaultCharsNames = await queries
    .getDefaultCharsNames()
    .then((response) => response.map((ele) => ele.name));
  defaultBody = {
    photoWidth: 400,
    photoHeight: 200,
    positionX: 0,
    positionY: 10,
    selected: defaultCharsNames[0],
  };

  const charactersData = await queries.getCharacters();
  // default characters data used for not having to manually search each characters intervals
  for (const char of charactersData) {
    defaultCorrectGuesses[char.name] = {
      positionX0: (char.positionL / 100) * defaultBody.photoWidth,
      positionY0: (char.positionT / 100) * defaultBody.photoHeight,
      positionX1: null,
      positionY1: null,
      deltaX: (char.widthPer / 100) * defaultBody.photoWidth,
      deltaY: (char.heightPer / 100) * defaultBody.photoHeight,
    };
    defaultCorrectGuesses[char.name].positionX1 =
      defaultCorrectGuesses[char.name].positionX0 +
      defaultCorrectGuesses[char.name].deltaX;
    defaultCorrectGuesses[char.name].positionY1 =
      defaultCorrectGuesses[char.name].positionY0 +
      defaultCorrectGuesses[char.name].deltaY;
  }
});

describe("/search", () => {
  describe("bad response", () => {
    it("empty sends", (done) => {
      request(app)
        .post("/search")
        .send()
        .expect(400)
        .expect("Request body shouldn't be empty", done);
    });

    it("missing body photoWidth data", async () => {
      delete defaultBody.photoWidth;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("missing body photoHeight data", async () => {
      delete defaultBody.photoHeight;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("missing body positionX data", async () => {
      delete defaultBody.positionX;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("missing body positionY data", async () => {
      delete defaultBody.positionY;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("missing body selected data", async () => {
      delete defaultBody.selected;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("missing multiple body data", async () => {
      delete defaultBody.photoHeight;
      delete defaultBody.positionX;
      delete defaultBody.selected;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("body photoWidth being 0", async () => {
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send({ ...defaultBody, photoWidth: 0 });
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body sent wrong data");
    });

    it("body photoHeight being 0", async () => {
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send({ ...defaultBody, photoHeight: 0 });
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body sent wrong data");
    });

    Object.keys(getNumericProperties(defaultBody)).forEach((key) => {
      it(`negative body ${key}`, async () => {
        const response = await request(app)
          .post("/search")
          .set("Accept", "application/json")
          .send({ ...defaultBody, [key]: -200 });
        expect(response.header["content-type"]).toMatch(/text/);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual("Request body sent wrong data");
      });
    });

    it("positionX not being in range", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, positionX: 450, photoWidth: 400 })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("positionY not being in range", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, positionY: 350, photoHeight: 200 })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("non existing character selected", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: "NotInDbChar" })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("body selected being falsy (false)", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: false })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("body selected being falsy (null)", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: null })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it(`body selected being falsy ("")`, (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: null })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });
  });
  describe("ok response", () => {
    it("missed search attempt", () => {
      return request(app)
        .post("/search")
        .send({ ...defaultBody })
        .set("Accept", "application/json")
        .expect(200)
        .then(async () => {
          const response = await request(app).get("/search");
          expect(response.status).toBe(200);
          expect(response.body).toEqual(await queries.getDefaultCharsNames());
        });
    });

    it("positionX being 0", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, positionX: 0 })
        .set("Accept", "application/json")
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });

    it("positionY being 0", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, positionY: 0 })
        .set("Accept", "application/json")
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });

    it("decrement lists of remaining characters on get req", () => {
      const agent = request.agent(app);
      return agent
        .post("/search")
        .send({
          ...defaultBody,
          positionX:
            defaultCorrectGuesses[defaultBody.selected].positionX0 +
            defaultCorrectGuesses[defaultBody.selected].deltaX / 2,
          positionY:
            defaultCorrectGuesses[defaultBody.selected].positionY0 +
            defaultCorrectGuesses[defaultBody.selected].deltaY / 2,
        })
        .set("Accept", "application/json")
        .expect(201)
        .then(async () => {
          const response = await agent.get("/search");
          expect(response.status).toBe(200);

          const event = (element) => element.name === defaultBody.selected;
          expect(response.body.some(event)).toBe(false);
        });
    });

    it("not decrement list of remaining characters on get req", () => {
      const agent = request.agent(app);
      return agent
        .post("/search")
        .send({
          ...defaultBody,
        })
        .set("Accept", "application/json")
        .expect(200)
        .then(async () => {
          const response = await agent.get("/search");
          expect(response.status).toBe(200);

          const event = (element) => element.name === defaultBody.selected;
          expect(response.body.some(event)).toBe(true);
        });
    });

    it("decrement list of remaining characters on get req (other character)", () => {
      const agent = request.agent(app);
      defaultBody.selected = defaultCharsNames[1];
      return agent
        .post("/search")
        .send({
          ...defaultBody,
          positionX:
            defaultCorrectGuesses[defaultBody.selected].positionX0 +
            defaultCorrectGuesses[defaultBody.selected].deltaX / 2,
          positionY:
            defaultCorrectGuesses[defaultBody.selected].positionY0 +
            defaultCorrectGuesses[defaultBody.selected].deltaY / 2,
        })
        .set("Accept", "application/json")
        .expect(201)
        .then(async () => {
          const response = await agent.get("/search");
          expect(response.status).toBe(200);

          const event = (element) => element.name === defaultBody.selected;
          expect(response.body.some(event)).toBe(false);
        });
    });

    it("not decrement list of remaining characters on get req (good coordinates for wrong character)", () => {
      const agent = request.agent(app);
      return agent
        .post("/search")
        .send({
          ...defaultBody,
          positionX:
            defaultCorrectGuesses[defaultCharsNames[1]].positionX0 +
            defaultCorrectGuesses[defaultCharsNames[1]].deltaX / 2,
          positionY:
            defaultCorrectGuesses[defaultCharsNames[1]].positionY0 +
            defaultCorrectGuesses[defaultCharsNames[1]].deltaY / 2,
        })
        .set("Accept", "application/json")
        .expect(200)
        .then(async () => {
          const response = await agent.get("/search");
          expect(response.status).toBe(200);

          const event = (element) => element.name === defaultBody.selected;
          expect(response.body.some(event)).toBe(true);
        });
    });
  });

  describe("accepted response", () => {
    it("accepted after all characters found", async () => {
      const agent = request.agent(app);
      while (defaultCharsNames.length) {
        const charName = defaultCharsNames.pop();
        const response = await agent
          .post("/search")
          .send({
            ...defaultBody,
            selected: charName,
            positionX:
              defaultCorrectGuesses[charName].positionX0 +
              defaultCorrectGuesses[charName].deltaX / 2,
            positionY:
              defaultCorrectGuesses[charName].positionY0 +
              defaultCorrectGuesses[charName].deltaY / 2,
          })
          .set("Accept", "application/json");
        expect(response.status).toBe(defaultCharsNames.length ? 201 : 202);
      }
    });
  });
});
