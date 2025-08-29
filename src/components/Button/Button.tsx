"use client";

import React from "react";
import clsx from "clsx";
import Loader from "../Loader/Loader";

interface ButtonProps {
  children: React.ReactNode;
  onButtonClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "flexColBtn" | "textOnly";
  type?: "button" | "submit" | "reset";
  isLeftIcon?: boolean;
  isRightIcon?: boolean;
  iconStyle?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  arialabel?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onButtonClick,
  disabled = false,
  className = "",
  icon,
  loading = false,
  variant = "primary",
  isLeftIcon = true,
  type = "button",
  isRightIcon = false,
  iconStyle = "",
  arialabel,
  onMouseEnter,
  onMouseLeave,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-0 px-3 py-2 group transition-all duration-400 ease-in-out w-full max-w-max relative";

  const variantStyles: Record<string, string> = {
    primary:
      "border border-gray-c bg-white rounded-sm text-gray hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-red-600 text-white hover:bg-white-500 hover:text-red-600 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed",
    flexColBtn:
      "text-gray-800 flex-col disabled:opacity-50 disabled:cursor-not-allowed",
    textOnly:
      "bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      onClick={onButtonClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || loading}
      type={type}
      aria-label={arialabel}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {loading ? (
        <Loader loaderFullScreen={false} isLoading={true} size="sm" color="border-red-600" />
      ) : (
        <>
          {isLeftIcon &&
            icon &&
            <span className={`flex items-center transition-all duration-400 ease-in-out ${iconStyle}`}>{icon}</span>
          }
          {children}
          {isRightIcon &&
            icon &&
            <span className={`flex items-center transition-all duration-400 ease-in-out ${iconStyle}`}>{icon}</span>
          }
        </>
      )}
    </button>
  );
};

export default Button;

