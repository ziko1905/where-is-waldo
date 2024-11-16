const queries = require("../models/queries");

async function initSessionRound(req, res, next) {
  if (!req.session.charactersLeft) {
    req.session.charactersLeft = await queries.getDefaultCharsNames();
  }

  next();
}

module.exports = initSessionRound;
