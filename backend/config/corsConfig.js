const corsConfig = {
  origin:
    process.env.MODE === "production"
      ? process.env.PROD_CLIENT_URL
      : [process.env.DEV_CLIENT_URL, process.env.PREW_CLIENT_URL],
  optionSuccessStatus: 200,
  credentials: true,
};

module.exports = corsConfig;
