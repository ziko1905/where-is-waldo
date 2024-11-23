/* eslint-disable no-undef */

const convertSID = require("./convertSID");

describe("convertSID()", () => {
  const sessionIDs = [
    "LQQIfKmILIJShhGr1HHS8_lJHgjcGXTo.Ie9HhyyOydr%2BuuR93HSCcTOvJwukKev0HuHHQcb3lnw",
    "KlDrijNJBWGMxowTxQNbSV_evNBpziQS.axwsg7CJZNQAfoFYgZtsenyi7LAJwKLJIw%2FKh%2FAiIjc",
    "lOPok-BMiAZcxyOP9Kd9pwtj3o_hgNkK.4861PCrqdEwrbm6u45kQpiKpglHmmyYT0n4KqykFCiI",
  ];

  it("converts correctly on one cookie", () => {
    for (const sID of sessionIDs) {
      expect(
        convertSID([
          `connect.sid=s%3A${sID}; Path=/; Expires=Mon, 25 Nov 2024 15:29:58 GMT; HttpOnly`,
        ])
      ).toBe(sID.split(".")[0]);
    }
  });

  it("converts correctly on multiple cookies (randomized)", () => {
    for (const sID of sessionIDs) {
      const cookies = [];
      const SIZE = 1000;
      for (let i = 0; i < Math.random() * SIZE; i++) {
        cookies.push(crypto.randomUUID());
      }

      cookies.splice(
        Math.floor(Math.random() * SIZE),
        0,
        `connect.sid=s%3A${sID}; Path=/; Expires=Mon, 25 Nov 2024 15:29:58 GMT; HttpOnly`
      );

      expect(convertSID(cookies)).toBe(sID.split(".")[0]);
    }
  });
});
