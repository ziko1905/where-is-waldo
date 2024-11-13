const express = require("express");
const app = express();
const searchRouter = require("./routes/searchRouter");

app.use("/search", searchRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
