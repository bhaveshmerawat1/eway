"use client";
import React, { useCallback } from "react";
import Button from "./Button/Button";
import "@/assets/styles/common.css";
import { useEmployees } from "@/context/EmployeeContext";

const SearchBar: React.FC = () => {
  const { search } = useEmployees();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      search.setSearchQuery(e.target.value);
    },
    [search.setSearchQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        search.setSearchQuery?.(search.searchQuery);
      }
    },
    [search.setSearchQuery, search.searchQuery]
  );

  return (
    <div className="searchbar">
      <input
        value={search.searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search employees..."
        aria-label="Search employees"
      />
      <Button
        onClick={() => search.setSearchQuery?.(search.searchQuery)}
        children={"Search"}
        arialabel="Search"
      />
    </div>
  );
};

export default SearchBar;
