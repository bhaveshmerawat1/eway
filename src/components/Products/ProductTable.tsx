"use client";

import React from "react";
import { useProducts } from "@/context/ProductContext";
import Button from "../Button/Button";

const ProductTable: React.FC = () => {
  const { products, modalAction } = useProducts();
  const { productFormModal, setEditing, askToDelete } = modalAction;

  return (
    <table className="w-full border border-gray-300 mt-6">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="px-3 py-2">Name</th>
          <th className="px-3 py-2">Product image</th>
          <th className="px-3 py-2">Description</th>
          <th className="px-3 py-2">Price</th>
          <th className="px-3 py-2">Size</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="odd:bg-white even:bg-gray-50">
            <td className="border border-gray-300 px-3 py-2">{p.name}</td>
            <td className="border border-gray-300 px-3 py-2">{<img
              src={p.imageUrl}
              alt={p.name}
              className="w-10 h-10 object-cover rounded"
            />}</td>
            <td className="border border-gray-300 px-3 py-2">{p.description}</td>
            <td className="border border-gray-300 px-3 py-2">${p.price.toFixed(2)}</td>
            <td className="border border-gray-300 px-3 py-2">{p.size || "-"}</td>
            <td className="border-gray-300 px-3 py-2 flex gap-3">
              <Button
                children="Edit"
                arialabel="editBtn"
                type="button"
                onClick={() => {
                  setEditing(p)
                  productFormModal.open()
                }}
                variant="primary"
                className="actionEditBtn px-4 "
              />
              <Button
                children="Delete"
                type="button"
                arialabel="deleteBtn"
                onClick={() => askToDelete(p)}
                variant="primary"
                className="actionEditBtn px-4"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
