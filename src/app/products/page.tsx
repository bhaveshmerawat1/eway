"use client";

import { useProducts } from "@/context/ProductContext";
import Button from "@/components/Button/Button";
import "@/assets/styles/common.css";
import AllProductList from "@/components/Products/AllProductList";
import ProductForm from "@/components/Products/ProductForm";
import ProductCart from "@/components/Products/ProductCart";
import Loader from "@/components/Loader/Loader";

export default function ProductsPage() {
  const { modalAction, isLoading } = useProducts();
  const modalOpen = modalAction?.productFormModal?.open
  return (
    <div className="page">
      <div className="topbar">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="topbar-title">Products</h1>
            <Button
              children={"+ Add New Product"}
              onClick={modalOpen}
              type="button"
              variant="primary"
              arialabel="add new Product"
              isTestID={"add-new-Product-id"}
            />
          </div>
        </div>
      </div>
      <div className="container">
        <AllProductList />
        <ProductForm />
        <ProductCart />
        <Loader size="lg" isLoading={isLoading} loaderFullScreen={true} />
      </div>

    </div>
  );
}
