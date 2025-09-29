// __tests__/layout.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("renders children inside layout", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello World</div>
      </RootLayout>
    );

    // Ensure child renders
    expect(screen.getByTestId("child")).toHaveTextContent("Hello World");

    // Ensure <html> and <body> are present
    expect(document.querySelector("html")).toBeInTheDocument();
    expect(document.querySelector("body")).toBeInTheDocument();

    // Ensure lang attribute is applied
    expect(document.querySelector("html")).toHaveAttribute("lang", "en");
  });
});
