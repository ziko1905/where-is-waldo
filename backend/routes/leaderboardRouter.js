const { Router } = require("express");
const router = Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/", leaderboardController.getLeaderboard);

module.exports = router;
