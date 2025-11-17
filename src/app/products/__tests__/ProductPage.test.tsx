import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductProvider } from "@/context/ProductContext";
import ProductsPage from "@/app/products/page";

jest.mock("react-icons/fa", () => ({
  FaShoppingCart: () => <svg data-testid="cart-icon" />,
}));

describe("ProductsPage", () => {
  it("renders Products page with all sections", () => {
    render(
      <ProductProvider>
        <ProductsPage />
      </ProductProvider>
    );
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByTestId("cartIconId")).toBeInTheDocument();
    expect(screen.getByText(/Product\(s\) Needed/i)).toBeInTheDocument();
  });
});
