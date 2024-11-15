const express = require("express");
const app = express();
const searchRouter = require("./routes/searchRouter");
const expressSession = require("express-session");
const {
  prismaSessionStore,
  PrismaSessionStore,
} = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const initSessionRound = require("./config/round");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
