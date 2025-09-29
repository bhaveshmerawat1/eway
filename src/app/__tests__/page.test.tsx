// __tests__/page.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock SearchAiPage component
jest.mock("@/app/searchAi/page", () => ({
  __esModule: true,
  default: () => <div data-testid="search-ai-page">Mock Search AI Page</div>,
}));

describe("Home Page", () => {
  it("renders SearchAiPage inside <main>", () => {
    render(<Home />);

    // Ensure mocked SearchAiPage renders
    expect(screen.getByTestId("search-ai-page")).toBeInTheDocument();

    // Ensure <main> is present
    expect(document.querySelector("main")).toBeInTheDocument();
  });
});
