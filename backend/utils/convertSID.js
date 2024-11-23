function getSidCookie(cookies) {
  for (const coo of cookies) {
    if (coo.includes("connect.sid")) return coo;
  }
}

module.exports = (cookies) => {
  const sessionCookie = getSidCookie(cookies);
  const id = sessionCookie.split(";")[0].split("=")[1].slice(4).split(".")[0];

  return id;
};
