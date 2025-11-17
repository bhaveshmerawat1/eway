import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductProvider } from "@/context/ProductContext";
import ProductCart from "@/components/Products/ProductCart";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("ProductCart", () => {
  it("renders nothing when orders list empty", () => {
    render(
      <ProductProvider>
        <ProductCart />
      </ProductProvider>
    );
    expect(screen.queryByText(/Shopping cart/i)).not.toBeInTheDocument();
  });
});
