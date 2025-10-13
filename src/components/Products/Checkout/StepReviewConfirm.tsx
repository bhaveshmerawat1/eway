import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import Button from "@/components/Button/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useRouter } from "next/navigation";

export default function StepReviewConfirm() {
  const { userInfo, deliveryInfo, setStep } = useCheckout();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter();

  const handleConfirm = () => {
    router.push("/products");
  };

  const handleConfirmOrder = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Review & Confirm</h2>

      <div className="mb-6">
        <h3 className="font-semibold">Customer Information</h3>
        <p>{userInfo.firstName} {userInfo.lastName}</p>
        <p>{userInfo.email}</p>
        <p>{userInfo.phone}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Delivery Address</h3>
        <p>{deliveryInfo.company}</p>
        <p>{deliveryInfo.address}</p>
        <p>{deliveryInfo.city}, {deliveryInfo.province} {deliveryInfo.postalCode}</p>
      </div>

      <div className="flex justify-between">
        <Button
          children={"Back"}
          variant="primary"
          type="button"
          onClick={() => setStep(2)}
          className="px-6 border-gray-300 text-gray-400"
        />
        <Button
          children={"Confirm Order"}
          variant="primary"
          type="button"
          onClick={handleConfirmOrder}
          className="px-6"
        />
      </div>
      <ConfirmDialog
        open={isModalOpen}
        title="Conform Order"
        message={`Your order has been confirmed!`}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Continue Shopping"
      />

    </div>
  );
}
