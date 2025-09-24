import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "@/components/Products/ProductForm";
import { useProducts } from "@/context/ProductContext";

jest.mock("@/context/ProductContext");

describe("ProductForm", () => {
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockClose = jest.fn();
  const mockSetEditing = jest.fn();

  beforeEach(() => {
    (useProducts as jest.Mock).mockReturnValue({
      createProduct: mockCreate,
      updateProduct: mockUpdate,
      modalAction: {
        editing: null,
        setEditing: mockSetEditing,
        productFormModal: { isOpen: true, close: mockClose, open: jest.fn() },
      },
    });
    jest.clearAllMocks();
  });

  it("renders Add Product form", () => {
    render(<ProductForm />);
    expect(screen.getByText("Add Product")).toBeInTheDocument();
  });

  it("submits new product", async () => {
    render(<ProductForm />);
    fireEvent.change(screen.getByPlaceholderText(/Product Name/i), { target: { value: "Lamp", name: "name" } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: "Nice lamp", name: "description" } });
    fireEvent.change(screen.getByPlaceholderText(/Price/i), { target: { value: "25", name: "price" } });
    fireEvent.submit(screen.getByRole("form"));
    expect(mockCreate).toHaveBeenCalled();
  });

  it("submits updated product if editing", () => {
    (useProducts as jest.Mock).mockReturnValue({
      createProduct: mockCreate,
      updateProduct: mockUpdate,
      modalAction: {
        editing: { id: "1", name: "Old Lamp", price: 10 },
        setEditing: mockSetEditing,
        productFormModal: { isOpen: true, close: mockClose },
      },
    });
    render(<ProductForm />);
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form"));
    expect(mockUpdate).toHaveBeenCalledWith("1", expect.any(FormData));
  });

  it("handles Cancel button", () => {
    render(<ProductForm />);
    fireEvent.click(screen.getByLabelText("cancelBtn"));
    expect(mockClose).toHaveBeenCalled();
    expect(mockSetEditing).toHaveBeenCalledWith(null);
  });

  it("handles file input", () => {
    render(<ProductForm />);
    const fileInput = screen.getByPlaceholderText(/Upload image/i);
    const file = new File(["hello"], "lamp.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.submit(screen.getByRole("form"));
    expect(mockCreate).toHaveBeenCalledWith(expect.any(FormData));
  });
});
