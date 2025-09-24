import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ProductSearchBar from "@/components/Products/ProductSearchBar";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductSearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input", () => {
    render(<ProductSearchBar />);
    expect(screen.getByPlaceholderText(/search product/i)).toBeInTheDocument();
  });

  it("shows loading skeleton when typing", async () => {
    render(<ProductSearchBar />);
    fireEvent.focus(screen.getByPlaceholderText(/search product/i));
    fireEvent.change(screen.getByPlaceholderText(/search product/i), { target: { value: "ta" } });

    expect(await screen.findByText(/Recent & Suggestions/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("fetches and shows suggestions", async () => {
    // mockedAxios.get.mockResolvedValueOnce({
    //   data: { products: [{ id: "1", name: "Table", price: 99 }] },
    // });
    // render(<ProductSearchBar />);
    // fireEvent.change(screen.getByPlaceholderText(/search product/i), { target: { value: "tab" } });

    // await waitFor(() => {
    //   expect(screen.getByText("Table")).toBeInTheDocument();
    // });
    mockedAxios.get.mockResolvedValueOnce({
      data: ["Table", "Tablet"],
    });

    render(<ProductSearchBar />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "ta" } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("ta")
      );
      expect(screen.getByText("Table")).toBeInTheDocument();
      expect(screen.getByText("Tablet")).toBeInTheDocument();
    });
  });

  it("handles no results", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { products: [] } });
    render(<ProductSearchBar />);
    fireEvent.change(screen.getByPlaceholderText(/search product/i), { target: { value: "xyz" } });
    await waitFor(() => {
      expect(screen.getByText("No results")).toBeInTheDocument();
    });
  });

  it("saves to history and highlights match", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { products: [{ id: "2", name: "Table", price: 10 }] } });
    render(<ProductSearchBar />);
    const input = screen.getByPlaceholderText(/search product/i);
    fireEvent.change(input, { target: { value: "Tab" } });
    await waitFor(() => screen.getByText("Table"));
    fireEvent.click(screen.getByText("Table"));
    fireEvent.focus(input);
    expect(screen.getByText(/Tab/i)).toBeInTheDocument();
  });
});
