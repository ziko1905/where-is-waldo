import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Photo from "../Photo";

describe("generic", () => {
  it("renders photo", () => {
    render(<Photo />);

    expect(() => screen.getByRole("img")).not.toThrow();
  });
});
