const queries = require("../models/queries");
const asyncHandler = require("express-async-handler");

module.exports.getLeaderboard = asyncHandler(async (req, res) => {
  res.send(await queries.getLeaderboard(+req.query.size || 7));
});

module.exports.postLeaderboard = asyncHandler(async (req, res) => {
  await queries.createPlayer(
    req.body.name,
    await queries.getSessionTime(req.sessionID)
  );
  res.status(200).send();
});
