"use client";

import { useProducts } from "@/context/ProductContext";
import ProductSearchBar from "@/components/Products/ProductSearchBar";
import ProductForm from "@/components/Products/ProductForm";
import ProductTable from "@/components/Products/ProductTable";
import ProductDeleteConfirm from "@/components/Products/ProductDeleteConfirm";
import Button from "@/components/Button/Button";
import "@/assets/styles/common.css";

export default function ProductsPage() {
  const { modalAction } = useProducts();
  const modalOpen = modalAction?.productFormModal?.open
  return (
    <div className="page">
      <div className="topbar">
        <div className="container">
          <div className="flex items-center">
            <h1 className="topbar-title">Products</h1>
          </div>
        </div>
      </div>
      <div className="container">
        {/* Search Bar */}
        <div className="flex justify-between">
          <ProductSearchBar />
          <Button
            children={"+ Add New Product"}
            onButtonClick={modalOpen}
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
