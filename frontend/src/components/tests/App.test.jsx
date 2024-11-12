import { expect, it, describe } from "vitest";
import App from "../../App";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("Generic App Tests", () => {
  it("renders headline", () => {
    render(<App />);

    expect(screen.getByRole("heading").textContent).toBe("Where's Waldo?");
  });
  it("renders photo", () => {
    render(<App />);

    expect(() =>
      screen.getByAltText("Crowded picture where Waldo and friends are hidden")
    ).not.toThrow();
  });
});

describe("selection functionality", () => {
  it("renders target box on click", async () => {
    const user = userEvent.setup();

    render(<App />);
    const img = screen.getByAltText(
      "Crowded picture where Waldo and friends are hidden"
    );

    await user.click(img);

    expect(() =>
      screen.getByLabelText("Selection box for characters found")
    ).not.toThrow();
  });

  it("dosn't render target box when not clicked", async () => {
    render(<App />);
    const img = screen.getByAltText(
      "Crowded picture where Waldo and friends are hidden"
    );

    expect(() =>
      screen.getByLabelText("Selection box for characters found")
    ).toThrow();
  });

  // Clicked something other than photo
  it("dosn't render target box when photo not clicked", async () => {
    const user = userEvent.setup();

    render(<App />);
    const img = screen.getByRole("heading");

    await user.click(img);

    expect(() =>
      screen.getByLabelText("Selection box for characters found")
    ).toThrow();
  });
});
