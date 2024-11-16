const asyncHandler = require("express-async-handler");
const { getNumericProperties } = require("../utils");
const queries = require("../models/queries");

module.exports.postSearchedChars = asyncHandler(async (req, res) => {
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

  if (!req.body.photoWidth || !req.body.photoHeight) {
    return res.status(400).send("Request body sent wrong data");
  }

  if (!(await queries.getDefaultCharsNames()).includes(req.body.selected)) {
    return res.status(400).send("Request body sent wrong data");
  }

  res.status(200).send("TO BE IMPLEMENTED");
});
