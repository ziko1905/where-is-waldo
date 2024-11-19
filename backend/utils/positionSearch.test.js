/* eslint no-undef: "off" */
const { getPixelIntervals, validateSearch } = require("./positionSearch");

let mockPercentages = {
  posT: 50,
  posL: 50,
  widthPer: 10,
  heightPer: 10,
};

let mockPhotoSize;

function resetMockValues() {
  mockPercentages = {
    posT: 50,
    posL: 50,
    widthPer: 10,
    heightPer: 10,
  };

  //1000 is convenient for easy calculations
  mockPhotoSize = {
    width: 1000,
    height: 1000,
  };
}

resetMockValues();

beforeEach(() => {
  resetMockValues();
});

describe("getPixelIntervals()", () => {
  const expectedErrors = {
    posT: "Top position",
    posL: "Left position",
    widthPer: "Width percentage",
    heightPer: "Height percentage",
    width: "Photo width",
    height: "Photo height",
  };

  it.each(
    Object.entries({ ...mockPercentages, ...mockPhotoSize }).map(
      ([key, value]) => ({ key: key, value: value })
    )
  )("throw on negative $key", ({ key, value }) => {
    expect(() =>
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          [key]: -value,
        })
      )
    ).toThrow(`${expectedErrors[key]} can't be negative`);
  });

  it("throw on photo width being 0", () => {
    expect(() =>
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          width: 0,
        })
      )
    ).toThrow("Photo width can't be 0");
  });

  it("throw on photo height being 0", () => {
    expect(() =>
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          height: 0,
        })
      )
    ).toThrow("Photo height can't be 0");
  });

  it("throw on missing arguments", () => {
    expect(() => {
      delete mockPercentages.posL;
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
        })
      );
    }).toThrow("Invalid Call: Missing arguments");
  });

  it("return [500, 600, 500, 600] for default mocking arguments", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
        })
      )
    ).toEqual([500, 600, 500, 600]);
  });

  it("return [250, 300, 250, 300] for height and width of 500", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          width: 500,
          height: 500,
        })
      )
    ).toEqual([250, 300, 250, 300]);
  });

  it("return [200, 300, 500, 600] for posL being 20", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          posL: 20,
        })
      )
    ).toEqual([200, 300, 500, 600]);
  });

  it("return [200, 300, 500, 600] for posT being 20", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          posT: 20,
        })
      )
    ).toEqual([500, 600, 200, 300]);
  });

  it("return [500, 1000, 500, 600] for widthPer being 50", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          widthPer: 50,
        })
      )
    ).toEqual([500, 1000, 500, 600]);
  });

  it("return [500, 600, 500, 1000] for heightPer being 50", () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          heightPer: 50,
        })
      )
    ).toEqual([500, 600, 500, 1000]);
  });

  it(`return [500, 555, 500, 1000] for widthPer being 5.5`, () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          widthPer: 5.5,
        })
      )
    ).toEqual([500, 555, 500, 600]);
  });

  it(`return [500, 555.5, 500, 1000] for widthPer being 5.55`, () => {
    expect(
      getPixelIntervals(
        ...Object.values({
          ...mockPercentages,
          ...mockPhotoSize,
          widthPer: 5.55,
        })
      )
    ).toEqual([500, 555.5, 500, 600]);
  });
});

describe("validateSearch()", () => {
  it("throw on missing arguments", () => {
    expect(() =>
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550
      )
    ).toThrow("Invalid Call: Missing arguments");
  });

  it("throw on searchX being negative", () => {
    expect(() =>
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        -550,
        550
      )
    ).toThrow("Search x coordinate can't be negative");
  });

  it("throw on searchY being negative", () => {
    expect(() =>
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        -550
      )
    ).toThrow("Search y coordinate can't be negative");
  });

  it("return true on valid search", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        550
      )
    ).toBe(true);
  });

  it("return true on valid edge search (x0 == searchX) ", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        500,
        550
      )
    ).toBe(true);
  });

  it("return true on valid edge search (x1 == searchX) ", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        600,
        550
      )
    ).toBe(true);
  });

  it("return true on valid edge search (y0 == searchY) ", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        500
      )
    ).toBe(true);
  });

  it("return true on valid edge search (y1 == searchY) ", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        600
      )
    ).toBe(true);
  });

  it("return false on invalid search", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        450,
        450
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (x0)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        499,
        550
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (x1)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        601,
        550
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (x0)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        499,
        550
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (x1)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        601,
        550
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (y0)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        499
      )
    ).toBe(false);
  });

  it("return false on invalid edge search (x1)", () => {
    expect(
      validateSearch(
        ...getPixelIntervals(
          ...Object.values({ ...mockPercentages, ...mockPhotoSize })
        ),
        550,
        601
      )
    ).toBe(false);
  });
});
