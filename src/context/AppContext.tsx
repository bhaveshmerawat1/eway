"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getProducts, getCategories, getUsers, getSubCategories, getdetaildProduct } from "../utils/api";
import localUsers from "../utils/appData.json";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  brand?: string;
  category?: string;
  sku:string
}

interface User {
  id: number;
  userId: string;
  name: string;
}

interface AuthUser extends User {
  isGuest?: boolean;
}

interface CatData {
  name: string;
  slug: string;
  url: string;
}

interface SubCatData {
  products: any[];
  total: number;
  skip: number;
  limit: number;
}

interface AppContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: CatData[];
  users: User[];
  loading: boolean;
  authUser: AuthUser | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  fetchAllData: () => Promise<void>;
  token: string | null;
  subCategoriesData: SubCatData | null;
  fetchSubCategories: (categoryName: string) => Promise<void>;
  fetchProductByTitle: (title: string) => Promise<void>;
  detailProduct: any;
  brand:any

  // New filter/sort state
  sortBy: string;
  setSortBy: (value: string) => void;
  filterByCategory: (category: string) => void;
  filterByBrand: (brand: string) => void;
  resetFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CatData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [subCategoriesData, setSubCategoriesData] = useState<SubCatData | null>(null);
  const [detailProduct, setDetailProduct] = useState();
  const [sortBy, setSortBy] = useState<string>("");
  const [brand, setBrand] =useState<[] | null>(null)

  // ✅ Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
        getUsers(),
      ]);
      setProducts(prodData);
      setFilteredProducts(prodData); // initialize filter state
      setCategories(catData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = (userID: string, password: string): boolean => {
    const user = localUsers.users.find((u) => u.userId === userID && u.password === password);

    if (!user) {
      setAuthUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    const token = `dummy-token-${user.id}`;
    setAuthUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return true;
  };

  // ✅ Logout
  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // ✅ Subcategories
  const fetchSubCategories = async (categoryName: string) => {
    try {
      const resData = await getSubCategories(categoryName);
      setSubCategoriesData(resData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // ✅ Product detail
  const fetchProductByTitle = async (id: string) => {
    try {
      const resData = await getdetaildProduct(id);
      setDetailProduct(resData);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // ✅ Filtering & Sorting Logic
  useEffect(() => {
    let updated = [...products];

    // Sorting
    if (sortBy === "az") updated.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "za") updated.sort((a, b) => b.title.localeCompare(a.title));

    setFilteredProducts(updated);
  }, [sortBy, products]);

  const filterByCategory = (category: string) => {
    setFilteredProducts(products.filter((p) => p.category === category));
  };

  const filterByBrand = (brand: string) => {
    setFilteredProducts(products.filter((p) => p.brand === brand));
  };

  const resetFilters = () => {
    setFilteredProducts(products);
    setSortBy("");
  };

  // ✅ Initial load
  useEffect(() => {
    fetchAllData();
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        users,
        loading,
        authUser,
        login,
        logout,
        fetchAllData,
        token,
        subCategoriesData,
        fetchSubCategories,
        detailProduct,
        fetchProductByTitle,

        // Filters & sorting
        sortBy,
        setSortBy,
        filterByCategory,
        filterByBrand,
        resetFilters,
        brand
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
