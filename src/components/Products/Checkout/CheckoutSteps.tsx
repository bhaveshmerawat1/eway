import React from "react";
import { useCheckout } from "@/context/CheckoutContext";

const steps = ["Customer Information", "Delivery Details", "Review & Confirm"];

export default function CheckoutSteps() {
  const { step } = useCheckout();

  return (
    <div className="flex items-center justify-center gap-30 mt-15 pb-10 stepsContainer">
      {steps.map((label, i) => {
        const index = i + 1;
        const active = step >= index;
        const isLast = i === steps.length - 1;
        return (
          <div key={label} className="flex flex-col items-center relative">
            <div
              className={`w-5 h-5 rounded-full border-2 fill z-[2] relative ${active ? "bg-[#7b4cf2] border-[#7b4cf2]" : "border-gray-300 bg-white"
                }`}
            >
              {!isLast && (
                <div className={`absolute h-[2px] w-[259px] top-[6px] z-[1] left-[16px] centerLine ${active ? "bg-[#7b4cf2]" : "bg-gray-300"}`} />
              )}</div>
            <p
              className={`text-[18px] mt-2 ${active ? "text-[#7b4cf2] font-medium" : "text-gray-500"
                }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
