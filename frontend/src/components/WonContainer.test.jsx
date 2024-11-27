/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import WonContainer from "./WonContainer";
import { vi } from "vitest";

vi.mock(import("./Leaderboard.jsx"), () => ({
  default: () => {
    return (
      <>
        <div data-testid={"lb-mock"}></div>
      </>
    );
  },
}));

vi.mock(import("./PlayerAddContainer.jsx"), () => ({
  default: () => {
    return (
      <>
        <div data-testid={"pac-mock"}></div>
      </>
    );
  },
}));

describe("WonContainer()", () => {
  it("renders self", () => {
    render(<WonContainer />);

    expect(() => screen.getByTestId("lb-mock")).not.toThrow();
  });

  //pac is alias for 'PlayerAddContainer'
  it("renders pac", () => {
    render(<WonContainer isSaved={false} />);

    expect(() => screen.getByTestId("pac-mock")).not.toThrow();
  });

  it("doesn't render pac", () => {
    render(<WonContainer isSaved={true} />);

    expect(() => screen.getByTestId("pac-mock")).toThrow();
  });

  it("renders lb regardless of pac (pac included)", () => {
    render(<WonContainer isSaved={false} />);

    expect(() => screen.getByTestId("lb-mock")).not.toThrow();
    expect(() => screen.getByTestId("pac-mock")).not.toThrow();
  });

  it("renders lb regardless of pac (pac excluded)", () => {
    render(<WonContainer isSaved={true} />);

    expect(() => screen.getByTestId("lb-mock")).not.toThrow();
    expect(() => screen.getByTestId("pac-mock")).toThrow();
  });
});
