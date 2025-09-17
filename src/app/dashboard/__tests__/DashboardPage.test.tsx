import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/context/AuthContext";
import { useEmployees } from "@/context/EmployeeContext";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock EmployeeContext
jest.mock("@/context/EmployeeContext", () => ({
  useEmployees: jest.fn(),
}));

// ✅ Mock ProtectedRoute to always render children
jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("DashboardPage", () => {
  it("calls logout and navigates to login when Log Out button clicked", async () => {
    const mockLogout = jest.fn();
    const mockPush = jest.fn();

    // Mock hooks
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useEmployees as jest.Mock).mockReturnValue({
      modalAction: {
        employeeFormModal: { isOpen: false, open: jest.fn(), close: jest.fn() },
        confirmEmployeeDeleteAction: { isOpen: false, close: jest.fn() },
        setEditing: jest.fn(),
        confirmDelete: jest.fn(),
        toDeleteRef: { current: null },
        editing: null,
        isLoading: false,
      },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<DashboardPage />);

    // ✅ Now the button should always render
    const logoutButton = screen.getByTestId("log-out-btn-id");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
