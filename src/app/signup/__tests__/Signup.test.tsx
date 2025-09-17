import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/signup/page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock window.alert
window.alert = jest.fn();

describe("SignupPage", () => {
  const signupMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuth as jest.Mock).mockReturnValue({
      signup: signupMock,
      loading: false,
    });
  });

  test("renders inputs and buttons", () => {
    render(<SignupPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("submits signup form successfully and redirects", async () => {
    signupMock.mockResolvedValueOnce(true);

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith("new@example.com", "mypassword");
      expect(window.alert).toHaveBeenCalledWith("Congratulation");
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error message when signup fails", async () => {
    signupMock.mockRejectedValueOnce({
      response: { data: { error: "User already exists" } },
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "exists@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpass" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  test("navigates to login page when Login button is clicked", () => {
    render(<SignupPage />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  test("toggles password visibility when eye icon is clicked", () => {
    render(<SignupPage />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const icon = screen.getByTestId("input-icon-id");
    fireEvent.click(icon);

    expect(passwordInput.type).toBe("text");
  });

  test("shows loader when loading is true", () => {
    (useAuth as jest.Mock).mockReturnValue({
      signup: signupMock,
      loading: true,
    });

    render(<SignupPage />);
  });
});
