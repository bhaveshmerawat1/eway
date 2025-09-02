import React from "react";
import styles from "../Button/Button.module.css";
import clsx from "clsx";

// Button props
type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?:string;
  disabled?: boolean;
  arialabel?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className ="",
  disabled,
  arialabel
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={arialabel}
      className={clsx(styles.buttonStyle, className, styles[variant], disabled ? "disabledStyle" : null)}
    >
      {children}
    </button>
  );
};

export default Button;
