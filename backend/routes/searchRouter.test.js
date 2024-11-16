const searchRouter = require("./searchRouter");
const request = require("supertest");
const express = require("express");
const queries = require("../models/queries");
const app = express();
const { getNumericProperties } = require("../utils");

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
    positionX: 0,
    positionY: 10,
    selected: await queries
      .getDefaultCharsNames()
      .then((response) => response[0].name),
  };
});

describe("/search", () => {
  describe("bad requests", () => {
    it("bad request on empty sends", (done) => {
      request(app)
        .post("/search")
        .send()
        .expect(400)
        .expect("Request body shouldn't be empty", done);
    });

    it("bad request on missing body photoWidth data", async () => {
      delete defaultBody.photoWidth;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("bad request on missing body photoHeight data", async () => {
      delete defaultBody.photoHeight;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("bad request on missing body positionX data", async () => {
      delete defaultBody.positionX;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("bad request on missing body positionY data", async () => {
      delete defaultBody.positionY;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("bad request on missing body selected data", async () => {
      delete defaultBody.selected;
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send(defaultBody);
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body missing data");
    });

    it("bad request on missing multiple body data", async () => {
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

    it("bad request on body photoWidth being 0", async () => {
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send({ ...defaultBody, photoWidth: 0 });
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body sent wrong data");
    });

    it("bad request on body photoHeight being 0", async () => {
      const response = await request(app)
        .post("/search")
        .set("Accept", "application/json")
        .send({ ...defaultBody, photoHeight: 0 });
      expect(response.header["content-type"]).toMatch(/text/);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual("Request body sent wrong data");
    });

    Object.keys(getNumericProperties(defaultBody)).forEach((key) => {
      it(`bad request on negative body ${key}`, async () => {
        const response = await request(app)
          .post("/search")
          .set("Accept", "application/json")
          .send({ ...defaultBody, [key]: -200 });
        expect(response.header["content-type"]).toMatch(/text/);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual("Request body sent wrong data");
      });
    });

    it("bad request on positionX not being in range", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, positionX: 450, photoWidth: 400 })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("bad request on non existing character selected", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: "NotInDbChar" })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("bad request on body selected being falsy (false)", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: false })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it("bad request on body selected being falsy (null)", (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: null })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });

    it(`bad request on body selected being falsy ("")`, (done) => {
      request(app)
        .post("/search")
        .send({ ...defaultBody, selected: null })
        .set("Accept", "application/json")
        .expect("Content-Type", /text/)
        .expect(400)
        .expect("Request body sent wrong data", done);
    });
  });
});
