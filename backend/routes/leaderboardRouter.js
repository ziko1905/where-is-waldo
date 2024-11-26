const { Router } = require("express");
const router = Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/", leaderboardController.getLeaderboard);
router.post(
  "/",
  leaderboardController.validatePostPlayer,
  leaderboardController.postLeaderboard
);
router.get("/won", leaderboardController.getHasWon);

module.exports = router;
