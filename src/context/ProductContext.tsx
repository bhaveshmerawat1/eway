"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import useToggle from "@/hooks/useToggle";

// --- Special Order Interface ---
interface SpecialOrder {
  id: string;
  productName: string;
  quantity: number;
}

// --- Context Value Interface ---
interface ProductContextValue {

  isLoading: boolean;
  modalAction: {
    addToCartModal: ReturnType<typeof useToggle>;
  };
  orders: SpecialOrder[];
  addOrder: (order: SpecialOrder) => Promise<void>;
}

// --- Context Initialization ---
const ProductContext = createContext<ProductContextValue | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const addToCartModal = useToggle(false);
  // Loader
  const [isLoading, setIsLoading] = useState(false);

  // Special Orders states
  const [orders, setOrders] = useState<SpecialOrder[]>([]);

  //  Special Orders 
  const addOrder = async (order: SpecialOrder) => {
    console.log("Adding special order:", order);
    try {
      setIsLoading(true);
      const res = await api.post("/products/special-order", order);
      specialProducts();
    } catch (err) {
      console.error("Error submitting special order:", err);
      setIsLoading(false);
    }
  }

  const specialProducts = async () => {
    try {
      const res = await api.get("/products/special-order");
      setOrders(res.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Fetch initial data
  useEffect(() => {
    specialProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        isLoading,
        modalAction: {
          addToCartModal,
        },
        addOrder,
        orders,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider");
  return ctx;
}