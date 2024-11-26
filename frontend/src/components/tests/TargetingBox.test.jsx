import { findByLabelText, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TargetingBox from "../TargetingBox";
import { mockLeftChars } from "../../mocks/characters";

describe("generic", () => {
  // TB alias for TargetingBox
  it("TB renders", () => {
    render(<TargetingBox />);

    expect(() =>
      screen.findByAltText("Selection box for character found")
    ).not.toThrow();
  });
});

describe("selection", () => {
  // Characters are "Waldo", "Wizard"...
  // Mocking get request from backend
  it("renders all unfound characters", async () => {
    render(<TargetingBox />);
    const charDivs = await screen.findAllByTestId("character-left");
    expect(
      await Promise.all(
        [...charDivs].map((div) =>
          findByLabelText(div, "Character name").then((ele) => ele.textContent)
        )
      )
    ).toEqual(mockLeftChars.getCharsNames());
  });
});
