// tests/context/AuthContext.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { api } from "../../../test/__mocks__/axios";

jest.mock("@/lib/axios");

// ✅ Test component that uses AuthContext
const TestAuth = () => {
  const { user, login, signup, logout } = useAuth();

  return (
    <div>
      <div data-testid="userID">{user ? user.email : "no-user"}</div>
      <button
        onClick={() => login("test@example.com", "123456")}
        data-testid="login-btn"
      >
        Login
      </button>
      <button
        onClick={() => signup("new@example.com", "654321")}
        data-testid="signup-btn"
      >
        Signup
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads initial user from /auth/me", async () => {
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === "/auth/me") {
        return Promise.resolve({ data: { id: 1, email: "me@example.com" } });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("userID")).toHaveTextContent("me@example.com");
    });
  });

  it("logs in and sets user", async () => {
    (api.post as jest.Mock).mockImplementation((url) => {
      if (url === "/auth/login") {
        return Promise.resolve({ data: { id: 2, email: "test@example.com" } });
      }
      return Promise.resolve({ data: {} });
    });
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId("login-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("userID")).toHaveTextContent("test@example.com");
    });
  });

  it("shows error on failed login", async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId("login-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  it("signs up and sets user", async () => {
    (api.post as jest.Mock).mockImplementation((url) => {
      if (url === "/auth/signup") {
        return Promise.resolve({ data: { id: 3, email: "new@example.com" } });
      }
      return Promise.resolve({ data: {} });
    });
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId("signup-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("new@example.com");
    });
  });

  it("shows error on failed signup", async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "User already exists" } },
    });
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId("signup-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "User already exists"
      );
    });
  });

  it("logs out and clears user", async () => {
    (api.post as jest.Mock).mockImplementation((url) => {
      if (url === "/auth/logout") {
        return Promise.resolve({ data: { success: true } });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId("logout-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("no-user");
    });
  });
});
