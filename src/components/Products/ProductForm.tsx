"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/context/ProductContext";
import Input from "../Inputs/Inputs";
import Button from "../Button/Button";

const ProductForm: React.FC = () => {
  const { createProduct, updateProduct, modalAction } = useProducts();
  const { editing, setEditing, productFormModal } = modalAction;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description || "",
        price: String(editing.price),
        size: editing.size || "",
      });
    } else {
      setForm({ name: "", description: "", price: "", size: "" });
      setImageFile(null);
    }
  }, [editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // handle submit into formdata edit/ new product 
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("size", form.size);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (editing) {
      await updateProduct(editing.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  if (!productFormModal.isOpen) return null;

  return (
   <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Product" : "Add Product"}
          </h2>
          <form role="form" onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              inputStyle="!border-none"
            />
            <Input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              inputStyle="!border-none"
            />
            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              inputStyle="!border-none"
            />
            <Input
              type="text"
              name="size"
              placeholder="Size"
              value={form.size}
              onChange={handleChange}
              inputStyle="!border-none"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
              aria-label="image"
              placeholder="Upload image"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                children="Cancel"
                arialabel="cancelBtn"
                type="button"
                onButtonClick={() => {
                  productFormModal.close();
                  setEditing(null);
                }}
                variant="primary"
                className="actionEditBtn px-4 "
              />
              <Button
                children={editing ? "Update" : "Create"}
                arialabel="updateCreateBtn"
                type="submit"
                variant="primary"
                className="actionEditBtn px-4 "
              />
            </div>
          </form>
        </div>
      </div>

   </>
  );
};

export default ProductForm;
