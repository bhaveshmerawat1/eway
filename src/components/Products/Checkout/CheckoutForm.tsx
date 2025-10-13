"use client"
import React from "react";
import { useCheckout } from "@/context/CheckoutContext";
import StepCustomerInfo from "./StepCustomerInfo";
import StepDeliveryDetails from "./StepDeliveryDetails";
import StepReviewConfirm from "./StepReviewConfirm";
import CheckoutSteps from "./CheckoutSteps";

export default function CheckoutForm() {
  const { step } = useCheckout();

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>
      <CheckoutSteps />
      <div className="mt-10">
        {step === 1 && <StepCustomerInfo />}
        {step === 2 && <StepDeliveryDetails />}
        {step === 3 && <StepReviewConfirm />}
      </div>
    </div>
  );
}
