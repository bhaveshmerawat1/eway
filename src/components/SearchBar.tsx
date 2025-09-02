"use client";
import React from "react";
import Button from "./Button/Button";
import "@/assets/styles/common.css"

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch?: (v: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search employees..."

}) => {
  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(value)}
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
