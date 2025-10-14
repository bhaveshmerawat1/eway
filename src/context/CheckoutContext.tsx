"use client";
import React, { createContext, useContext, useState } from "react";
import { api } from "@/lib/axios";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface DeliveryInfo {
  company: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

interface CheckoutContextType {
  step: number;
  setStep: (n: number) => void;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  deliveryInfo: DeliveryInfo;
  setDeliveryInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
  allCheckouts: any[];
  saveCheckout: () => Promise<void>;
  fetchCheckouts: () => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    company: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [allCheckouts, setAllCheckouts] = useState<any[]>([]);

  const saveCheckout = async () => {
    console.log("checkout order==============", userInfo, deliveryInfo)
    try {
      const res = await api.post("/products/checkout", { userInfo, deliveryInfo });
      console.log("✅ Checkout saved:", res.data);
    } catch (err: any) {
      console.error("❌ Save checkout error:", err);
    }
  };

  const fetchCheckouts = async () => {
    try {
      const res = await api.get("/products/checkout");
      setAllCheckouts(res.data);
      console.log("📦 All checkouts:", res.data);
    } catch (err: any) {
      console.error("❌ Fetch checkouts error:", err);
    }
  };
  return (
    <CheckoutContext.Provider
      value={{
        step, setStep, userInfo, setUserInfo, deliveryInfo,
        setDeliveryInfo, allCheckouts, saveCheckout,
        fetchCheckouts
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
};
