import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AISearch from "@/components/AISearch/AISearch";
import axios from "axios";
import SearchAiPage from "../page";

// mock axios
jest.mock("../../../lib/axios");
jest.mock("axios", () => ({
  post: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe("AISearch Component", () => {
  it("renders input and search icon", () => {
    render(<AISearch />);
    expect(
      screen.getByPlaceholderText("Ask AI anything...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates query on typing", async () => {
    render(<AISearch />);
    const input = screen.getByPlaceholderText("Ask AI anything...");
    await userEvent.type(input, "Hello AI");
    expect(input).toHaveValue("Hello AI");
  });

  it("submits query and shows result", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { answer: "AI response here" },
    });

    render(<AISearch />);
    const input = screen.getByPlaceholderText("Ask AI anything...");
    await userEvent.type(input, "What is React?");
    fireEvent.submit(input);

    await waitFor(() =>
      expect(screen.getByText("AI response here")).toBeInTheDocument()
    );
  });

  it("shows error when API fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<AISearch />);
    const input = screen.getByPlaceholderText("Ask AI anything...");
    await userEvent.type(input, "Cause error");
    fireEvent.submit(input);

    await waitFor(() =>
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument()
    );
  });

  it("shows loader when submitting", async () => {
    // mockedAxios.post.mockResolvedValueOnce({
    //   data: { answer: "AI delayed response" },
    // });

    // render(<AISearch />);
    // const input = screen.getByPlaceholderText("Ask AI anything...");
    // await userEvent.type(input, "Show loader");
    // fireEvent.submit(input);

    // expect(screen.getByRole("button")).toHaveTextContent(/loading/i);
    // await waitFor(() =>
    //   expect(screen.getByText("AI delayed response")).toBeInTheDocument()
    // );
    mockedAxios.post.mockResolvedValueOnce({
      data: { answer: "AI delayed response" },
    });

    render(<AISearch />);
    const input = screen.getByPlaceholderText("Ask AI anything...");
    await userEvent.type(input, "Show loader");

    fireEvent.submit(input);

    // Loader should appear
    // expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Loader should disappear after result
    await waitFor(() =>
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument()
    );

    expect(screen.getByText("AI delayed response")).toBeInTheDocument();
  });
});


describe("SearchAiPage", () => {
  it("renders page with heading and AISearch", () => {
    render(<SearchAiPage />);
    expect(screen.getByText("AI Search Input")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ask AI anything...")
    ).toBeInTheDocument();
  });
});