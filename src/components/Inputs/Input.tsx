import React from "react";
import clsx from "clsx";
import { FaExclamationCircle } from "react-icons/fa";
import Button from "../Button/Button";

type InputProps = {
  type?: "text" | "search" | "number" | "password" | "tel" | "email" | "checkbox";
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  name?: string;
  maxLength?: number;
  inputLabel?: boolean;
  inputLabelName?: string;
  labelStyle?: string;
  isErrors?: boolean;
  isErrorMessage?: string;
  onClickIcon?: () => void;
  isInlineText?: string;
  inputStyle?: string;
  id?: string;
};

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  iconPosition = "left",
  disabled = false,
  name,
  maxLength,
  inputLabel,
  inputLabelName,
  labelStyle,
  isErrors = false,
  isErrorMessage = "",
  onClickIcon,
  isInlineText,
  inputStyle = "",
  id,

}) => {
  return (
    <>
    {inputLabel && <label htmlFor={id ?? name} className={clsx("block mb-1 text-[12px] text-color",labelStyle)}>{inputLabelName}</label>}
    <div
      className={clsx(
        "flex items-center border justify-between border-gray-300 rounded-md bg-white transition-all duration-500 ease-in-out relative",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon && iconPosition === "left" && (
        <Button className="mr-2 text-gray-500" variant="textOnly" children={icon} onButtonClick={onClickIcon}/>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        maxLength={maxLength}
        id={id ?? name} 
        className={clsx("w-full outline-none py-2 px-2 text-sm bg-transparent",inputStyle)}
      />

      {icon && iconPosition === "right" && (
        <Button className="ml-2 text-gray-500" variant="textOnly" children={icon} onButtonClick={onClickIcon}/>
      )}
      {isInlineText && (
        <span className="text-gray-500 text-sm">{isInlineText}</span>
      )}
    </div>
      {isErrors && (
        <p className="flex items-center text-red-600 text-xs mt-1">
          <FaExclamationCircle className="mr-1" /> {isErrorMessage}
        </p>
      )}
    </>
  );
};

export default Input;
