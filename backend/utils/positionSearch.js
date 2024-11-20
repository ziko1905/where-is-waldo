class InvalidValueError extends Error {
  constructor(value) {
    super(value);
    this.value = value;
    this.name = "InvalidValueError";
  }
  isNegative() {
    this.message = `${
      this.value.charAt(0).toUpperCase() + this.value.slice(1)
    } can't be negative`;
    return this;
  }

  isZero() {
    this.message = `${
      this.value.charAt(0).toUpperCase() + this.value.slice(1)
    } can't be 0`;
    return this;
  }
}

function getPixelIntervals(
  posL,
  posT,
  widthPer,
  heightPer,
  photoWidth,
  photoHeight
) {
  if ([...arguments].length < 6) {
    throw new Error("Invalid Call: Missing arguments");
  }

  const errMsgs = {
    0: "left position",
    1: "top position",
    2: "width percentage",
    3: "height percentage",
    4: "photo width",
    5: "photo height",
  };
  for (const [arg, val] of Object.entries(arguments)) {
    if (val < 0) {
      throw new InvalidValueError(errMsgs[arg]).isNegative();
    }
  }

  if (photoWidth === 0 || photoHeight === 0) {
    throw new InvalidValueError(
      `Photo ${!photoWidth ? "width" : "height"}`
    ).isZero();
  }

  const x0 = (photoWidth * posL) / 100;
  const deltaX = (photoWidth * widthPer) / 100;
  const x1 = x0 + deltaX;

  const y0 = (photoHeight * posT) / 100;
  const deltaY = (photoHeight * heightPer) / 100;
  const y1 = y0 + deltaY;

  return [x0, x1, y0, y1];
}

function validateSearch(x0, x1, y0, y1, searchX, searchY) {
  if ([...arguments].length < 6) {
    throw new Error("Invalid Call: Missing arguments");
  }

  if (searchX < 0) {
    throw new InvalidValueError("Search x coordinate").isNegative();
  } else if (searchY < 0) {
    throw new InvalidValueError("Search y coordinate").isNegative();
  }

  return searchX >= x0 && searchX <= x1 && searchY >= y0 && searchY <= y1
    ? true
    : false;
}

module.exports = {
  getPixelIntervals,
  validateSearch,
};
