const asyncHandler = require("express-async-handler");
const { getNumericProperties } = require("../utils/utils");
const queries = require("../models/queries");
const {
  getPixelIntervals,
  validateSearch,
} = require("../utils/positionSearch");

module.exports.postSearchedCharsValidation = asyncHandler(
  async (req, res, next) => {
    if (!Object.keys(req.body).length) {
      return res.status(400).send("Request body shouldn't be empty");
    }
    const dataKeys = [
      "photoWidth",
      "photoHeight",
      "positionX",
      "positionY",
      "selected",
    ];

    for (const key of dataKeys) {
      if (!Object.keys(req.body).includes(key)) {
        return res.status(400).send("Request body missing data");
      }
    }

    for (const value of Object.values(getNumericProperties(req.body))) {
      if (value < 0) {
        return res.status(400).send("Request body sent wrong data");
      }
    }

    if (
      !req.body.photoWidth ||
      !req.body.photoHeight ||
      req.body.positionX > req.body.photoWidth ||
      req.body.positionY > req.body.photoHeight
    ) {
      return res.status(400).send("Request body sent wrong data");
    }

    if (
      !(await queries.getDefaultCharsNames())
        .map((character) => character.name)
        .includes(req.body.selected)
    ) {
      return res.status(400).send("Request body sent wrong data");
    }

    next();
  }
);

module.exports.postSearchedChars = asyncHandler(async (req, res) => {
  const pixelIntervals = getPixelIntervals(
    ...(await queries.getPositionData(req.body.selected)),
    req.body.photoWidth,
    req.body.photoHeight
  );

  if (
    validateSearch(...pixelIntervals, req.body.positionX, req.body.positionY)
  ) {
    req.session.charactersLeft = req.session.charactersLeft.filter(
      (ele) => ele.name != req.body.selected
    );
  } else {
    return res.status(200).send();
  }

  if (!req.session.charactersLeft.length) {
    req.session.hasWon = true;
    req.session.time = Date.now() - req.session.timeStart;
    return res.status(202).send({ time: req.session.time });
  }
  res.status(201).send();
});

module.exports.getSearchLeft = async (req, res) => {
  return res.status(200).send(req.session.charactersLeft);
};
