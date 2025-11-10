"use client";
import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";
import Button from "../Button/Button";
import { useProducts } from "@/context/ProductContext";

interface ProductItem {
  quantity: string;
  description: string;
}

const SpecialOrderProductListForm: React.FC = () => {
  const [items, setItems] = useState<ProductItem[]>([{ quantity: "", description: "" }]);
  const { addOrder } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = () => {
    setItems([...items, { quantity: "", description: "" }]);
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [{ quantity: "", description: "" }]);
  };

  const handleChange = (index: number, field: keyof ProductItem, value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddToSpecialOrder = async () => {
    try {
      setIsSubmitting(true);

      // Filter out empty rows
      const validItems = items.filter((item) => item.description && item.quantity);

      if (validItems.length === 0) {
        alert("Please enter at least one valid product with quantity and description.");
        return;
      }

      // Loop through items and send each to API
      for (const item of validItems) {
        await addOrder({
          id: "", // ID will be assigned by backend
          productName: item.description,
          quantity: Number(item.quantity),
        });
      }

      // Reset form
      setItems([{ quantity: "", description: "" }]);
      alert("Special order submitted successfully!");
    } catch (err) {
      console.error("Error submitting special order:", err);
      alert("Failed to submit special order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm w-full max-w-6xl mx-auto">
      <h2 className="text-gray-800 font-semibold text-lg mb-2">Product(s) Needed</h2>
      <p className="text-sm text-gray-600">
        Please enter the quantity and description for each item you are looking for. Please provide
        as much detail as possible so that we can properly source your item(s).
      </p>

      <p className="text-sm text-gray-800 font-semibold mt-2">
        A minimum quantity may be needed to complete your order; you will be notified of this
        requirement at the time of receiving your quote.
      </p>

      <p className="text-sm text-gray-700 font-semibold mt-1">
        Special orders are not returnable, unless damaged or defective.
      </p>

      <div className="mt-4 space-y-3 border border-gray-200 rounded-md p-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <input
              type="number"
              placeholder="Quantity*"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              className="md:w-1/3 sm:w-1/5 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-0 focus:outline-none"
            />

            <input
              type="text"
              placeholder="Description*"
              value={item.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-0 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              {index === items.length - 1 && (
                <Button
                  onClick={handleAdd}
                  type="button"
                  variant="primary"
                  arialabel="add special order item"
                  isTestID={"add-special-order-item-id"}
                  icon={<Plus size={16} />}
                  isLeftIcon={true}
                  className="border rounded-md"
                  children={""}
                />
              )}

              {items.length > 1 && (
                <Button
                  onClick={() => handleDelete(index)}
                  type="button"
                  variant="secondary"
                  arialabel="delete special order item"
                  isTestID={"delete-special-order-item-id"}
                  icon={<Trash size={16} />}
                  isLeftIcon={true}
                  className="border border-red-400 rounded-md"
                  children={""}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-end">
        <Button
          children={isSubmitting ? "Submitting..." : "Submit"}
          type="button"
          variant="primary"
          arialabel="submit special order"
          isTestID={"submit-special-order-id"}
          className="mt-4 disabled:opacity-60"
          onClick={handleAddToSpecialOrder}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SpecialOrderProductListForm;
