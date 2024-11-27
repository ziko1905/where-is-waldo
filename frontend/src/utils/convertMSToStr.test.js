/* eslint-disable no-undef */
import convertMSToStr from "./convertMSToStr";

describe("convertMSToStr()", () => {
  it("converts milliseconds", () => {
    expect(convertMSToStr(123)).toBe("00:00:00:12");
    expect(convertMSToStr(127)).toBe("00:00:00:12");
    expect(convertMSToStr(523)).toBe("00:00:00:52");
    expect(convertMSToStr(527)).toBe("00:00:00:52");
    expect(convertMSToStr(999)).toBe("00:00:00:99");
    expect(convertMSToStr(100)).toBe("00:00:00:10");
    expect(convertMSToStr(10)).toBe("00:00:00:01");
  });

  it("converts seconds", () => {
    expect(convertMSToStr(5000)).toBe("00:00:05:00");
    expect(convertMSToStr(55000)).toBe("00:00:55:00");
    expect(convertMSToStr(23232)).toBe("00:00:23:23");
    expect(convertMSToStr(59999)).toBe("00:00:59:99");
    expect(convertMSToStr(10001)).toBe("00:00:10:00");
  });

  it("converts minutes", () => {
    expect(convertMSToStr(5 * 60 * 1000)).toBe("00:05:00:00");
    expect(convertMSToStr(59 * 60 * 1000 + 272)).toBe("00:59:00:27");
    expect(convertMSToStr(10 * 60 * 1000 + 25 * 1000 + 10)).toBe("00:10:25:01");
  });

  it("converts hours", () => {
    expect(convertMSToStr(5 * 60 * 60 * 1000)).toBe("05:00:00:00");
    expect(convertMSToStr(59 * 60 * 60 * 1000 + 272)).toBe("59:00:00:27");
    expect(
      convertMSToStr(69 * 60 * 60 * 1000 + 10 * 60 * 1000 + 25 * 1000 + 10)
    ).toBe("69:10:25:01");
    expect(convertMSToStr(404 * 60 * 60 * 1000 + 59 * 60 * 1000 + 272)).toBe(
      "404:59:00:27"
    );
  });
});
