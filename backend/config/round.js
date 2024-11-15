const queries = require("../models/queries");

async function initSessionRound(req, res, next) {
  if (!req.session.charactersLeftIds) {
    req.session.charactersLeftIds = await queries.getDefaultCharsId();
  }

  next();
}

module.exports = initSessionRound;
