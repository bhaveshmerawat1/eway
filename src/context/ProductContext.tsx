"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import useToggle from "@/hooks/useToggle"; 

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  size?: string;
  imageUrl?: string;
}

interface ProductContextValue {
  products: Product[];
  reloadProducts: () => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, data: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  modalAction: {
    productFormModal: ReturnType<typeof useToggle>;
    editing: Product | null;
    setEditing: (p: Product | null) => void;
    confirmDeleteModal: ReturnType<typeof useToggle>;
    toDeleteRef: React.MutableRefObject<Product | null>;
    askToDelete: (p: Product) => void;
    confirmDelete: () => Promise<void>;
  };
}

const ProductContext = createContext<ProductContextValue | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const productFormModal = useToggle(false);
  const confirmDeleteModal = useToggle(false);
  const toDeleteRef = useRef<Product | null>(null);

  async function reloadProducts() {
    const res = await api.get("/products");
    setProducts(res.data.products || []);
  }

  async function createProduct(data: FormData) {
    console.log("create product ============", data)
    try {
      const response = await api.post("/products", data); // no need to set Content-Type

      console.log("Product created:", response.data);

      // Refresh product list
      await reloadProducts();

      // Close modal
      productFormModal.close();
    } catch (err: any) {
      console.error("Create product error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to create product");
    }
  }

  async function updateProduct(id: string, formData: FormData) {
    try {
      const response = await api.put(`/products/${id}`, formData); // FormData with file

      console.log("Product updated:", response.data.product);

      await reloadProducts();
      productFormModal.close();
    } catch (err: any) {
      console.error("Update product error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to update product");
    }
  }

  async function deleteProduct(id: string) {
    await api.delete(`/products/${id}`);
    await reloadProducts();
  }

  function askToDelete(p: Product) {
    toDeleteRef.current = p;
    confirmDeleteModal.open();
  }

  async function confirmDelete() {
    if (!toDeleteRef.current) return;
    await deleteProduct(toDeleteRef.current.id);
    confirmDeleteModal.close();
    toDeleteRef.current = null;
  }

  // async function searchResult(params: any,delay: any){
  //   api.get("/products/search", { params}),
  //   delay
  // }

  useEffect(() => {
    reloadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        reloadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        modalAction: {
          productFormModal,
          editing,
          setEditing,
          confirmDeleteModal,
          toDeleteRef,
          askToDelete,
          confirmDelete,
        },
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