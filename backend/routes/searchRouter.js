const { Router } = require("express");
const router = Router();
const searchController = require("../controllers/searchController");

router.post("/", searchController.postSearchedChars);
router.get("/", searchController.getSearchLeft);

module.exports = router;
