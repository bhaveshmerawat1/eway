import axiosInstance from "./axiosInstance";

// Products
export const getProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data.products;
};

// Categories
export const getCategories = async () => {
  const res = await axiosInstance.get("/products/categories");
  return res.data;
};
// Sub Categories
export const getSubCategories = async (categoryName:string) =>{
  const res = await axiosInstance.get(`/products/category/${categoryName}`);
  return res.data;
}

// Detailed product 
export const getdetaildProduct = async (id:string) =>{
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
}

// Users (example)
export const getUsers = async () => {
  const res = await require("../utils/appData.json");
  return res.users;
};
