/* eslint-disable no-undef */
const isAscending = require("./isAscending");

describe("isAscending()", () => {
  it("return true on asc arr of size 2", () => {
    expect(isAscending([1, 2])).toBe(true);
  });

  it("return false on desc arr of size 2", () => {
    expect(isAscending([2, 1])).toBe(false);
  });

  it("return true on asc arr of size 5", () => {
    expect(isAscending([1, 2, 3, 4, 5])).toBe(true);
  });

  it("return false on desc arr of size 5", () => {
    expect(isAscending([1, 2, 3, 4, 5])).toBe(true);
  });

  it("return false on partly asc arr (first elem switched)", () => {
    expect(isAscending([2, 1, 3, 4, 5])).toBe(false);
  });

  it("return true when looking for asc by a", () => {
    expect(
      isAscending(
        [
          { a: 1, b: 3 },
          { a: 2, b: 2 },
          { a: 3, b: 1 },
        ],
        (data) => data.a
      )
    ).toBe(true);
  });

  it("return false when looking for asc by b", () => {
    expect(
      isAscending(
        [
          { a: 1, b: 3 },
          { a: 2, b: 2 },
          { a: 3, b: 1 },
        ],
        (data) => data.b
      )
    ).toBe(false);
  });
});
