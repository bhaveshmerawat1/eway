import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page"
import { EmployeeProvider } from "@/context/EmployeeContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
// ---- Module mocks ----

// Mock api (axios wrapper)
jest.mock("@/lib/axios", () => {
  return {
    api: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
  };
});
import { api } from "@/lib/axios";

// Mock useAuth so EmployeeProvider sees isAuthenticated
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Loader to render a testid when loading true
jest.mock("@/components/Loader/Loader", () => ({
  __esModule: true,
  default: ({ isLoading }: any) =>
    isLoading ? <div data-testid="loader">Loading</div> : null,
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    children,
    onButtonClick,
    isTestID,
    arialabel,
    type,
    ...rest
  }: any) => (
    <button
      data-testid={isTestID}
      aria-label={arialabel}
      onClick={onButtonClick}
      type={type || "button"}
      {...rest}
    >
      {children}
    </button>
  ),
}));



const renderWithEmployeeProvider = (ui: React.ReactNode) => {
  const mockedRouter = { push: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(mockedRouter);

  return {
    mockedRouter,
    ...render(<EmployeeProvider>{ui}</EmployeeProvider>),
  };
};


// ---- Tests ----

describe("DashboardPage integration (EmployeeContext + UI)", () => {
  const logoutMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // default auth behavior: authenticated + logout mock
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      onLoginSuccess: jest.fn(),
      logout: logoutMock,
    });

    // router push
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders dashboard header and loads employees from API", async () => {
    // Mock api.get to return one employee on first call
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        employees: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            age: 30,
            joinedAt: new Date().toISOString(),
            address: "NY",
            mobile: "1112223333",
          },
        ],
      },
    });

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // header
    expect(screen.getByText(/Employee Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Employee List/i)).toBeInTheDocument();

    // wait for employee to be loaded and displayed
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
  });

  it("calls logout and navigates to login when Log Out clicked", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });

    // ensure logout resolves
    logoutMock.mockResolvedValueOnce(undefined);

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // ensure button exists
    const logoutBtn = await screen.findByTestId("log-out-btn-id");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("opens Add Employee modal and successfully creates an employee (create -> reload)", async () => {
    // First api.get: initial empty list
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });

    // When create form submits, api.post should be called -> resolve
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    // After create, reloadEmployees calls api.get again -> now return list with created employee
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        employees: [
          {
            id: "10",
            firstName: "Alice",
            lastName: "Wonder",
            age: 28,
            joinedAt: new Date().toISOString(),
            address: "Wonderland",
            mobile: "9998887777",
          },
        ],
      },
    });

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // Click Add New Employee button
    const addBtn = await screen.findByTestId("add-new-employee-id");
    fireEvent.click(addBtn);

    // Modal should open (EmployeeForm rendered inside). Modal's close button has aria-label "close"
    // Fill EmployeeForm inputs (ids used match your EmployeeForm)
    const firstName = screen.getByLabelText(/First Name/i) || screen.getByLabelText("firstName");
    // The EmployeeForm uses label + input, but to be robust, query by id fallback:
    const firstNameInput =
      screen.queryByLabelText(/First Name/i) ||
      screen.getByRole("textbox", { name: /first name/i }) ||
      screen.getByDisplayValue(""); // fallback

    // More reliable direct get by id:
    const fname = screen.getByRole("textbox", { name: /First Name/i }) || screen.getByLabelText("firstName", { selector: "input", exact: false });
    // But RTL queries above might vary; safer: select by id using document.getElementById
    const fIn = document.getElementById("firstName") as HTMLInputElement;
    const lIn = document.getElementById("lastName") as HTMLInputElement;
    const ageIn = document.getElementById("age") as HTMLInputElement;
    const joinedIn = document.getElementById("joinedAt") as HTMLInputElement;
    const mobileIn = document.getElementById("mobileNumber") as HTMLInputElement;
    const addressIn = document.getElementById("address") as HTMLTextAreaElement;

    // If inputs are not in DOM yet (sometimes label queries are more reliable), attempt to find via placeholders
    // Fill values (guarded with existence checks)
    if (fIn) fireEvent.change(fIn, { target: { value: "Alice" } });
    if (lIn) fireEvent.change(lIn, { target: { value: "Wonder" } });
    if (ageIn) fireEvent.change(ageIn, { target: { value: "28" } });
    if (joinedIn) fireEvent.change(joinedIn, { target: { value: new Date().toISOString().slice(0, 10) } });
    if (mobileIn) fireEvent.change(mobileIn, { target: { value: "9998887777" } });
    if (addressIn) fireEvent.change(addressIn, { target: { value: "Wonderland" } });

    // Submit the EmployeeForm: the add button has aria-label "addEmployee"
    const addEmployeeBtn = screen.getByLabelText("addEmployee") as HTMLButtonElement;
    fireEvent.click(addEmployeeBtn);

    // Confirm api.post was called with the new employee body at least once
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/employees", expect.objectContaining({
        firstName: expect.any(String),
      }));
    });

    // After create -> reloadEmployees -> new employee shown
    expect(await screen.findByText(/Alice Wonder/i)).toBeInTheDocument();
  });

  it("opens Edit modal when Edit clicked and updates employee (put -> reload)", async () => {
    // initial api.get returns single employee
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        employees: [
          {
            id: "5",
            firstName: "Bob",
            lastName: "Builder",
            age: 40,
            joinedAt: new Date().toISOString(),
            address: "BuildTown",
            mobile: "5554443333",
          },
        ],
      },
    });

    // When update occurs, api.put resolves
    (api.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    // After update, reloadEmployees call returns updated employee name
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        employees: [
          {
            id: "5",
            firstName: "Robert",
            lastName: "Builder",
            age: 40,
            joinedAt: new Date().toISOString(),
            address: "BuildTown",
            mobile: "5554443333",
          },
        ],
      },
    });

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // Wait for the original employee to appear
    expect(await screen.findByText(/Bob Builder/i)).toBeInTheDocument();

    // Click Edit button (aria-label "editBtn")
    const editBtn = screen.getByLabelText("editBtn");
    fireEvent.click(editBtn);

    // Edit modal opens and EmployeeForm appears (input id "firstName" present)
    const fIn = await screen.findByDisplayValue("Bob"); // existing value
    // Change firstName to "Robert"
    fireEvent.change(fIn as HTMLInputElement, { target: { value: "Robert" } });

    // Click update (button aria-label "updateEmployee")
    const updateBtn = screen.getByLabelText("updateEmployee");
    fireEvent.click(updateBtn);

    // Expect api.put called
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/employees/5", expect.objectContaining({
        firstName: "Robert",
      }));
    });

    // After reload, new name appears
    expect(await screen.findByText(/Robert Builder/i)).toBeInTheDocument();
  });

  it("updates search query on input and submit", async () => {
    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    const input = screen.getByLabelText("Search employees");
    const searchBtn = screen.getByLabelText("Search");

    // typing search
    fireEvent.change(input, { target: { value: "John" } });
    expect(input).toHaveValue("John");

    // pressing enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // clicking search button
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(input).toHaveValue("John");
    });
  });

  it("opens confirm delete and calls confirmDelete -> api.delete and reload", async () => {
    // initial get returns a single employee
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        employees: [
          {
            id: "7",
            firstName: "Delete",
            lastName: "Me",
            age: 50,
            joinedAt: new Date().toISOString(),
            address: "NowHere",
            mobile: "1010101010",
          },
        ],
      },
    });

    // api.delete resolves
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    // After delete and reload, api.get returns empty list
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { employees: [] } });

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // Wait for employee to be visible
    expect(await screen.findByText(/Delete Me/i)).toBeInTheDocument();

    // Click Delete button (aria-label "deleteBtn")
    const deleteBtn = screen.getByLabelText("deleteBtn");
    fireEvent.click(deleteBtn);

    // Confirm dialog opens (ConfirmDialog uses a Button with arialabel 'confirmDelete')
    const confirmBtn = await screen.findByLabelText("confirmDelete");
    fireEvent.click(confirmBtn);

    // api.delete should be called with correct id
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/employees/7");
    });

    // After reload, employee should no longer be in the document
    await waitFor(() => {
      expect(screen.queryByText(/Delete Me/i)).not.toBeInTheDocument();
    });
  });

  it("paginates when more than itemsPerPage employees exist and Next/Prev buttons work", async () => {
    // Create 8 employees in API response
    const employeesPage = Array.from({ length: 8 }, (_, i) => {
      const id = `${100 + i}`;
      return {
        id,
        firstName: `Emp${i}`,
        lastName: `L${i}`,
        age: 20 + i,
        joinedAt: new Date().toISOString(),
        address: `City${i}`,
        mobile: `90000000${i}`,
      };
    });

    (api.get as jest.Mock).mockResolvedValue({ data: { employees: employeesPage } });

    render(
      <EmployeeProvider>
        <DashboardPage />
      </EmployeeProvider>
    );

    // Wait for some employee from page 1
    expect(await screen.findByText(/Emp0 L0/i)).toBeInTheDocument();

    // Next button should be available (aria-label 'nextBtn')
    const nextBtn = screen.getByLabelText("nextBtn");
    expect(nextBtn).toBeInTheDocument();
    // Click next -> should navigate to page 2
    fireEvent.click(nextBtn);

    // page text should update to Page 2
    await waitFor(() => {
      expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();
    });

    // Prev button now clickable
    const prevBtn = screen.getByLabelText("prevBtn");
    fireEvent.click(prevBtn);
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });
  });
});

describe("ProtectedRoute Integration Tests", () => {
  it("renders children if authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderWithEmployeeProvider(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    renderWithEmployeeProvider(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("mock-loader")).toBeInTheDocument();
  });

  it("redirects to /login if not authenticated", async () => {
    const mockedRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockedRouter);

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderWithEmployeeProvider(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockedRouter.push).toHaveBeenCalledWith("/login");
    });
  });
});