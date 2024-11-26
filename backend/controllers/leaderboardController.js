const queries = require("../models/queries");
const asyncHandler = require("express-async-handler");

module.exports.getLeaderboard = asyncHandler(async (req, res) => {
  res.send(await queries.getLeaderboard(+req.query.size || 7));
});

module.exports.postLeaderboard = asyncHandler(async (req, res) => {
  await queries.createPlayer(req.body.name, req.session.time);
  res.status(200).send();
});

module.exports.validatePostPlayer = async (req, res, next) => {
  if (!req.session.hasWon || !req.session.time) {
    return res.status(400).send();
  }

  next();
};
