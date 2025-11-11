"use client";

import { useProducts } from "@/context/ProductContext";
import Button from "@/components/Button/Button";
import "@/assets/styles/common.css";
import ProductCart from "@/components/Products/ProductCart";
import Loader from "@/components/Loader/Loader";
import { FaShoppingCart } from "react-icons/fa";
import SpecialOrderProductListForm from "@/components/Products/SpecialOrder";

export default function ProductsPage() {
  const { modalAction, isLoading } = useProducts();
  const cartModalOpen = modalAction?.addToCartModal?.open
  return (
    <div className="page">
      <div className="topbar">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="topbar-title">Products</h1>
            <div className="flex items-center justify-end gap-3">
              <Button
                children={""}
                onClick={cartModalOpen}
                type="button"
                variant="primary"
                arialabel="cart icon"
                isTestID={"cartIconId"}
                icon={<FaShoppingCart />}
                isLeftIcon={true}
                className="py-3"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <SpecialOrderProductListForm />
        <ProductCart />
        <Loader size="lg" isLoading={isLoading} loaderFullScreen={true} />
      </div>

    </div>
  );
}
