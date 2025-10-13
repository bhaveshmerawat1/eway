import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import Input from "@/components/Inputs/Inputs";
import { validateDeliveryDetails } from "@/utils/validators";
import Button from "@/components/Button/Button";

export default function StepDeliveryDetails() {
  const { deliveryInfo, setDeliveryInfo, setStep } = useCheckout();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleNext = () => {
    const validationErrors = validateDeliveryDetails(deliveryInfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(3);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 text-[#7b4cf2]">Delivery Address</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            type="text"
            name="company"
            id="company"
            value={deliveryInfo.company}
            onChange={handleChange}
            placeholder="Enter your building name/house name"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.company ? "border-red-500 bg-red-100" : ""}`}
            inputStyle="border-0"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1 col-span-2">{errors.company}</p>
          )}
        </div>

        <div className="col-span-2">
          <Input
            type="text"
            name="address"
            id="address"
            value={deliveryInfo.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.address ? "border-red-500 bg-red-100" : ""}`}
            inputStyle="border-0"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <Input
            type="text"
            name="city"
            id="city"
            value={deliveryInfo.city}
            onChange={handleChange}
            placeholder="Enter your city"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.city ? "border-red-500 bg-red-100" : ""}`}
            inputStyle="border-0"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <Input
            type="text"
            name="postalCode"
            id="postalCode"
            value={deliveryInfo.postalCode}
            onChange={handleChange}
            placeholder="Enter your postalCode"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.postalCode ? "border-red-500 bg-red-100" : ""}`}
            inputStyle="border-0"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          children={"Back"}
          variant="primary"
          type="button"
          onClick={() => setStep(1)}
          className="px-6 border-gray-300 text-gray-400"
        />
        <Button
          children={"Next"}
          variant="primary"
          type="button"
          onClick={handleNext}
          className="px-6"
        />
      </div>
    </div>
  );
}
