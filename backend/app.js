const express = require("express");
const app = express();
const searchRouter = require("./routes/searchRouter");
const leaderboardRouter = require("./routes/leaderboardRouter");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const initSessionRound = require("./config/round");
const cors = require("cors");
const corsConfig = require("./config/corsConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsConfig));

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(initSessionRound);

app.use("/search", searchRouter);
app.use("/leaderboard", leaderboardRouter);

app.use((err, req, res, next) => {
  console.log(err);

  req.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
