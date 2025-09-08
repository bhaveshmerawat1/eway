import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { EmployeeProvider } from "@/context/EmployeeContext";

function renderWithProvider() {
  return render(
    <EmployeeProvider>
      <DashboardPage />
    </EmployeeProvider>
  );
}

describe("DashboardPage Integration", () => {

  it("renders header, search bar, and seeded employees", () => {
    renderWithProvider();

    expect(screen.getByText(/employee dashboard/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search employees/i)).toBeInTheDocument();
    expect(screen.getByText(/pierre/i)).toBeInTheDocument();
    expect(screen.getByText(/rajesh/i)).toBeInTheDocument();
  });

  it("filters employees via search bar", () => {
    renderWithProvider();

    const search = screen.getByPlaceholderText(/search employees/i);
    fireEvent.change(search, { target: { value: "rajesh" } });

    expect(screen.queryByText(/pierre/i)).not.toBeInTheDocument();
    expect(screen.getByText(/rajesh/i)).toBeInTheDocument();
  });

  it("opens Add Employee modal and adds new employee", async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole("button", { name: /add new employee/i }));

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: "2023-09-01" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "Paris" } });
    fireEvent.change(screen.getByLabelText(/mobile/i), { target: { value: "1234567890" } });

    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));
  });

  it("edits an existing employee", async () => {
    renderWithProvider();

    fireEvent.click(screen.getAllByRole("button", { name: /editbtn/i })[0]);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "New" } });

    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));
  });

  it("deletes an employee", async () => {
    renderWithProvider();

    // 1. Click the row delete button
    const rowDeleteButtons = screen.getAllByRole("button", { name: /deleteBtn/i });
    fireEvent.click(rowDeleteButtons[0]);

    // 2. Now find the confirm delete inside the dialog
    const confirmDeleteButton = await screen.findByRole("button", { name: /confirmDelete/i });
    fireEvent.click(confirmDeleteButton);
  });

  it("navigates pagination", () => {
    renderWithProvider();

    const nextBtn = screen.getByRole("button", { name: /prevBtn/});
    const prevBtn = screen.getByRole("button", { name: /nextBtn/i });

    expect(prevBtn).toBeDisabled();
    fireEvent.click(nextBtn);
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
  });

});
