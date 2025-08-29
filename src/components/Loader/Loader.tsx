import React from "react";
import clsx from "clsx";

interface LoaderProps {
  isLoading: boolean;
  size?: "sm" | "md" | "lg" | string;
  color?: string;
  className?: string;
  loaderFullScreen?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  size = "md",
  color = "border-red-800",
  className = "",
  loaderFullScreen = false,
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  const resolvedSizeClass =
    size in sizeClasses
      ? sizeClasses[size as keyof typeof sizeClasses]
      : size;

  return (
    loaderFullScreen ?
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className={clsx(
          "animate-spin rounded-full border-t-transparent ",
          resolvedSizeClass,
          color,
          className
        )} />
      </div> :
      <div
        className={clsx(
          "animate-spin rounded-full border-t-transparent ",
          resolvedSizeClass,
          color,
          className
        )}
      />
  );
};

export default Loader;
