import React from "react";
import { renderHook, act } from "@testing-library/react";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { api } from "@/lib/axios";

jest.mock("@/lib/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("ProductContext", () => {
  it("should load products on mount", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: "1", productName: "Test", quantity: 2 }] });
    const { result } = renderHook(() => useProducts(), {
      wrapper: ({ children }) => <ProductProvider>{children}</ProductProvider>,
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("should add a special order", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: "2", productName: "Chair", quantity: 1 } });

    const { result } = renderHook(() => useProducts(), {
      wrapper: ({ children }) => <ProductProvider>{children}</ProductProvider>,
    });

    await act(async () => {
      await result.current.addOrder({ id: "", productName: "Chair", quantity: 1 });
    });

    expect(api.post).toHaveBeenCalledWith("/products/special-order", { id: "", productName: "Chair", quantity: 1 });
  });
});
