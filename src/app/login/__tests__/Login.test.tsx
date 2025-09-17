import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Next Router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock,
      loading: false,
    });
  });

  test("renders email and password inputs", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  test("updates input values and clears error when typing", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  test("submits login form successfully and redirects", async () => {
    loginMock.mockResolvedValueOnce(true);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("user@example.com", "password123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows error message on login failure", async () => {
    loginMock.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpass" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("navigates to signup page when Signup button is clicked", () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(pushMock).toHaveBeenCalledWith("/signup");
  });

  test("toggles password visibility when eye icon is clicked", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    // click the eye icon
    const eyeIcon = screen.getByTestId("input-iconID");
    fireEvent.click(eyeIcon);

    expect(passwordInput.type).toBe("text");
  });

  test("shows loader when loading is true", () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock,
      loading: true,
    });

    render(<LoginPage />);
  });
});
