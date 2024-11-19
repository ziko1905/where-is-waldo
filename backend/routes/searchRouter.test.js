/* eslint no-undef: "off" */
const searchRouter = require("./searchRouter");
const request = require("supertest");
const express = require("express");
const queries = require("../models/queries");
const app = express();
const { getNumericProperties } = require("../utils/utils");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/search", searchRouter);

// Used for logging 500's
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send("Internal Server Error");
});

let defaultBody = {
  photoWidth: 400,
  photoHeight: 200,
  positionX: 0,
  positionY: 10,
  // Not fetched like in beforeEach
  selected: "Waldo",
};

beforeEach(async () => {
  // Needed for reset after each test
  defaultBody = {
    photoWidth: 400,
    photoHeight: 200,
    positionX: 10,
    positionY: 20,
    selected: await queries
      .getDefaultCharsNames()
      .then((response) => response[0].name),
  };
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
    it("missed search attempt", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody })
        .set("Accept", "application/json")
        .expect(200)
        .then(async () => {
          const response = await request(app).get("/search");
          expect(response.status).toBe(200);
          expect(response.body).toEqual(await queries.getDefaultCharsNames());
          done();
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
  });
});
