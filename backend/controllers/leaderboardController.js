const queries = require("../models/queries");

module.exports.getLeaderboard = async (req, res) => {
  res.send(await queries.getLeaderboard(+req.query.size || 7));
};
