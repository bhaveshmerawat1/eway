"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import useToggle from "@/hooks/useToggle";

// --- Product Interface ---
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  size?: string;
  imageUrl?: string;
}

// --- Cart Item Interface ---
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: Product; // ✅ nested product
}

// --- Context Value Interface ---
interface ProductContextValue {
  products: Product[];
  reloadProducts: () => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, data: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  cartItems: CartItem[];
  addItemToCart: (product: Product) => Promise<void>;
  removeItemFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;

  isLoading: boolean;
  modalAction: {
    productFormModal: ReturnType<typeof useToggle>;
    editing: Product | null;
    setEditing: (p: Product | null) => void;
    confirmDeleteModal: ReturnType<typeof useToggle>;
    toDeleteRef: React.MutableRefObject<Product | null>;
    askToDelete: (p: Product) => void;
    confirmDelete: () => Promise<void>;
    addToCartModal: ReturnType<typeof useToggle>;
  };
}

// --- Context Initialization ---
const ProductContext = createContext<ProductContextValue | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Product states
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const productFormModal = useToggle(false);
  const confirmDeleteModal = useToggle(false);  
  const toDeleteRef = useRef<Product | null>(null);

  // Cart states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const addToCartModal = useToggle(false);

  // Loader
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all products
  const reloadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // CRUD: Create Product
  async function createProduct(data: FormData) {
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

  // CRUD: Update Product
  async function updateProduct(id: string, formData: FormData) {
    try {
      const response = await api.put(`/products/${id}`, formData);
      await reloadProducts();
      productFormModal.close();
    } catch (err: any) {
      console.error("Update product error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to update product");
    }
  }

  // CRUD: Delete Product
  async function deleteProduct(id: string) {
    try {
      await api.delete(`/products/${id}`);
      await reloadProducts();
    } catch (err: any) {
      console.error("Delete product error:", err);
    }
  }

  // --- Delete Modal Actions ---
  const askToDelete = (p: Product) => {
    toDeleteRef.current = p;
    confirmDeleteModal.open();
  };

  async function confirmDelete() {
    if (!toDeleteRef.current) return;
    await deleteProduct(toDeleteRef.current.id);
    confirmDeleteModal.close();
    toDeleteRef.current = null;
  }

  // CART MANAGEMENT (connected with Next API)
  const fetchCart = async () => {
    try {
      const res = await api.get("/products/cart");
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const addItemToCart = async (product: Product) => {
    try {
      setIsLoading(true);
      await api.post("/products/cart", { productId: product.id, quantity: 1 });
      await fetchCart();
      addToCartModal.open();
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItemFromCart = async (id: string) => {
    try {
      setIsLoading(true);
      await api.delete("/products/cart", { data: { id } });
      await fetchCart();
    } catch (err) {
      console.error("Remove cart item error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await api.delete("/products/cart/clear");
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    reloadProducts();
    fetchCart();
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
        fetchCart,
        isLoading,
        modalAction: {
          productFormModal,
          editing,
          setEditing,
          confirmDeleteModal,
          toDeleteRef,
          askToDelete,
          confirmDelete,
          addToCartModal,
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