import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import Input from "@/components/Inputs/Inputs";
import { validateCheckoutUser } from "@/utils/validators";
import Button from "@/components/Button/Button";

export default function StepCustomerInfo() {
  const { userInfo, setUserInfo, setStep } = useCheckout();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });

    // clear error as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleNext = () => {
    const validationErrors = validateCheckoutUser(userInfo);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStep(2);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-[#7b4cf2]">
        User Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            value={userInfo.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.firstName ? "border-red-500 bg-red-100" : ""
              }`}
            inputStyle="border-0"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name (optional) */}
        <Input
          type="text"
          name="lastName"
          id="lastName"
          value={userInfo.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          maxLength={30}
          labelStyle="mt-2"
        />

        {/* Email */}
        <div>
          <Input
            type="email"
            name="email"
            id="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            maxLength={30}
            labelStyle="mt-2"
            className={`w-full ${errors.email ? "border-red-500 bg-red-100" : ""
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Input
            type="text"
            name="phone"
            id="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            maxLength={10}
            labelStyle="mt-2"
            className={`w-full ${errors.phone ? "border-red-500 bg-red-100" : ""
              }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
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
