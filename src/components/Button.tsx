"use client";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border border-gray-c rounded px-4 text-gray-800 text-[16px] w-full max-w-max py-1 hover:bg-gray-800 hover:text-white group transition-all 
							duration-400 ease-in-out font-myfont font-semibold
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"} 
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
