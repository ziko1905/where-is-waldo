import { expect, it, describe } from "vitest";
import App from "../../App";
import { render, screen } from "@testing-library/react";

describe("Generic App Tests", () => {
  it("renders headline", () => {
    render(<App />);

    expect(screen.getByRole("heading").textContent).toBe("Where's Waldo?");
  });
  it("renders photo", () => {
    render(<App />);

    expect(() => screen.getByRole("img")).not.toThrow();
  });
});

// describe("");
