const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send("router working");
});

module.exports = router;
