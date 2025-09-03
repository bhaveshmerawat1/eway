import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeForm from "@/components/EmployeeForm";
import { Employee } from "@/utils/EmployeeTypes";

describe("EmployeeForm", () => {
  const mockSubmit = jest.fn();

  const initialData: Employee = {
    id: "1",
    firstName: "Jane",
    lastName: "Smith",
    age: 30,
    address: "NY",
    mobile: "1234567890",
    joiningDate: "2024-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all fields in create mode", () => {
    render(<EmployeeForm mode="create" onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/joining date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /addemployee/i })).toBeInTheDocument();
  });

  test("pre-fills fields in edit mode", () => {
    render(<EmployeeForm mode="edit" initial={initialData} onSubmit={mockSubmit} />);

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("NY")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
  });

  test("shows validation errors if required fields are empty", () => {
    render(<EmployeeForm mode="create" onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("validates required fields", () => {
    render(<EmployeeForm mode="create" onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/joining date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile is required/i)).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("calls onSubmit with correct data in create mode", () => {
    render(<EmployeeForm mode="create" onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "LA" } });
    fireEvent.change(screen.getByLabelText(/mobile/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: "2025-09-01" } });

    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      age: 25,
      address: "LA",
      mobile: "9876543210",
      joiningDate: "2025-09-01"
    });
  });

  test("updates existing employee in edit mode", () => {
    render(<EmployeeForm mode="edit" initial={initialData} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Janet" } });
    fireEvent.click(screen.getByRole("button", { name: /addemployee/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      ...initialData,
      firstName: "Janet",
    });
  });
});
