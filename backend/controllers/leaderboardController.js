const queries = require("../models/queries");
const asyncHandler = require("express-async-handler");

module.exports.getLeaderboard = asyncHandler(async (req, res) => {
  res.send(await queries.getLeaderboard(+req.query.size || 7));
});

module.exports.postLeaderboard = asyncHandler(async (req, res) => {
  await queries.createPlayer(req.body.name, req.session.time, req.sessionID);
  res.status(200).send();
});

module.exports.validatePostPlayer = asyncHandler(async (req, res, next) => {
  const playerWithSID = await queries.getPlayerBySID(req.sessionID);
  const validatePost =
    !req.session.hasWon || !req.session.time || playerWithSID;

  if (validatePost) {
    return res.status(400).send();
  }

  next();
});

module.exports.isSaved = asyncHandler(async (req, res) => {
  const inLeaderboard = !!(await queries.getPlayerBySID(req.sessionID));
  res.status(200).send({ isSaved: inLeaderboard });
});

module.exports.hasWon = asyncHandler(async (req, res) => {
  return res.status(200).send({ hasWon: !!req.session.hasWon });
});
