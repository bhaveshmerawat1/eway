"use client";
import React, { useCallback } from "react";
import Button from "./Button/Button";
import "@/assets/styles/common.css"

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search employees..."

}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch?.(value);
      }
    },
    [onSearch, value]
  );
  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search employees"
      />
      <Button
        onClick={() => onSearch?.(value)}
        children={"Search"}
        arialabel="Search"
      />
    </div>
  );
};

export default SearchBar;
