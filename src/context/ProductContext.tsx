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

interface CartItem extends Product {
  quantity: number;
}

interface ProductContextValue {
  products: Product[];
  reloadProducts: () => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, data: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cartItems: CartItem[];
  addItemToCart: (product: Product) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  isLoading: boolean
  modalAction: {
    productFormModal: ReturnType<typeof useToggle>;
    editing: Product | null;
    setEditing: (p: Product | null) => void;
    confirmDeleteModal: ReturnType<typeof useToggle>;
    toDeleteRef: React.MutableRefObject<Product | null>;
    askToDelete: (p: Product) => void;
    confirmDelete: () => Promise<void>;
    addToCart: ReturnType<typeof useToggle>;
  };
}

const ProductContext = createContext<ProductContextValue | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const productFormModal = useToggle(false);
  const confirmDeleteModal = useToggle(false);
  const toDeleteRef = useRef<Product | null>(null);
  const addToCart = useToggle(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function reloadProducts() {
    const res = await api.get("/products");
    setProducts(res.data.products || []);
  }

  async function createProduct(data: FormData) {
    console.log("create product ============", data)
    try {
      const response = await api.post("/products", data);
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

  // Add to cart logic
  async function addItemToCart(product: Product) {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          // Update quantity if already in cart
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        // Add new item to cart
        return [...prev, { ...product, quantity: 1 }];
      });
      // Open the modal after successful update
      addToCart.open();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function removeItemFromCart(productId: string) {
    setIsLoading(true);
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    setIsLoading(false)
  }

  function clearCart() {
    setIsLoading(true);
    setCartItems([]);
    setIsLoading(false)
  }

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
        cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        isLoading,
        modalAction: {
          productFormModal,
          editing,
          setEditing,
          confirmDeleteModal,
          toDeleteRef,
          askToDelete,
          confirmDelete,
          addToCart
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