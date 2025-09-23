"use client";

import { useProducts } from "@/context/ProductContext";
import ProductSearchBar from "@/components/Products/ProductSearchBar";
import ProductForm from "@/components/Products/ProductForm";
import ProductTable from "@/components/Products/ProductTable";
import ProductDeleteConfirm from "@/components/Products/ProductDeleteConfirm";
import Button from "@/components/Button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/assets/styles/common.css";

export default function ProductsPage() {
  const { modalAction } = useProducts();
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogOut() {
    try {
      await logout()
      router.push("/login");
    } catch (err: any) {
      console.log("error", err)
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="topbar-title">Products</h1>
            <Button
              variant="textOnly"
              type="button"
              onButtonClick={handleLogOut}
              children={"Log Out"}
              className="text-white font-bold text-[20px]"
              isTestID={"log-out-btn-id"}
            />
          </div>
        </div>
      </div>
      <div className="container">
        {/* Search Bar */}
        <div className="flex justify-between">
          <ProductSearchBar />
          <Button
            children={"+ Add New Product"}
            onButtonClick={modalAction?.productFormModal?.open}
            type="button"
            variant="primary"
            arialabel="add new Product"
            isTestID={"add-new-Product-id"}
          />
        </div>
        {/* Table */}
        <ProductTable />

        {/* Modals */}
        <ProductForm />
        <ProductDeleteConfirm />
      </div>
    </div>
  );
}
