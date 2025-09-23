"use client";

import React from "react";
import { useProducts } from "@/context/ProductContext";

const ProductDeleteConfirm: React.FC = () => {
  const { modalAction } = useProducts();
  const { confirmDeleteModal, confirmDelete, toDeleteRef } = modalAction;

  if (!confirmDeleteModal.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
        <p className="mb-4">
          Are you sure you want to delete <b>{toDeleteRef.current?.name}</b>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={confirmDeleteModal.close}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteConfirm;
