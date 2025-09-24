import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductsPage from "@/app/products/page";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProductTable from "@/components/Products/ProductTable";

jest.mock("@/context/ProductContext");
jest.mock("@/context/AuthContext");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProductsPage Integration", () => {
  // const mockLogout = jest.fn();
  const mockRouterPush = jest.fn();
  const mockOpenProductForm = jest.fn();
  const mockSetEditing = jest.fn();
  const mockAskToDelete = jest.fn();

  beforeEach(() => {
    // (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useProducts as jest.Mock).mockReturnValue({
      products: [
        { id: "1", name: "Table", description: "Wooden", price: 99, size: "L" },
        { id: "2", name: "Chair", description: "Plastic", price: 49, size: "M" },
      ],
      modalAction: {
        productFormModal: { open: mockOpenProductForm, close: jest.fn(), isOpen: true },
        setEditing: mockSetEditing,
        askToDelete: mockAskToDelete,
        editing: null,
        // productFormModal: { open: mockOpenProductForm },
        confirmDeleteModal: { isOpen: false },
        confirmDelete: jest.fn(),
        toDeleteRef: { current: null },
      },
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
    });

    jest.clearAllMocks();
  });

  it("renders Products page with child components", () => {
    render(
      <ProductProvider>
        <ProductsPage />
      </ProductProvider>
    );
    expect(screen.getByTestId("add-new-Product-id")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search product/i)).toBeInTheDocument();
  });

  it("triggers product form modal when + Add New Product clicked", () => {
    render(<ProductsPage />);
    fireEvent.click(screen.getByTestId("add-new-Product-id"));
    expect(mockOpenProductForm).toHaveBeenCalledTimes(1);
  });

  it("renders product rows with Edit/Delete buttons", () => {
    render(<ProductsPage />);
    expect(screen.getByText("Table")).toBeInTheDocument();
    expect(screen.getByText("Chair")).toBeInTheDocument();
    render(<ProductTable />)
    fireEvent.click(screen.getByLabelText("editBtn"));
    expect(mockSetEditing).toHaveBeenCalledWith(expect.objectContaining({ name: "Table" }));

    fireEvent.click(screen.getByLabelText("deleteBtn"));
    expect(mockAskToDelete).toHaveBeenCalledWith(expect.objectContaining({ name: "Table" }));
  });
});
