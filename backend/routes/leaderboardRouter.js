const { Router } = require("express");
const router = Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/", leaderboardController.getLeaderboard);
router.post(
  "/",
  leaderboardController.validatePostPlayer,
  leaderboardController.postLeaderboard
);

module.exports = router;
