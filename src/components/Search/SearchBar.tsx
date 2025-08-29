"use client";
import React, { useState } from "react";
import Input from "../Inputs/Input";
import Button from "../Button/Button";
import clsx from "clsx";

interface SearchBarProps {
  placeholder?: string;
  inputStyle?: string;
  buttonStyle?: string;
  containerStyle?: string;
  disabled?: boolean;
  onSearch?: (query: string) => void;
  isSearchButton?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  inputStyle = "",
  buttonStyle = "",
  containerStyle = "",
  onSearch,
  disabled = false,
  isSearchButton = true,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={clsx("flex border border-gray-c rounded overflow-hidden w-full max-w-5/10 h-[36px]",containerStyle)}
      role="search"
    >
      {/* Search Input */}
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={clsx("flex-grow px-4 py-2 border-0 text-gray-800 outline-none focus:border-[0.5] focus:border-gray-c focus:border-r-0", inputStyle)}
        aria-label={placeholder}
        maxLength={200}
        icon={null}
      />
      {/* Search Button with icon */}
      {isSearchButton &&
        <Button
          children={null}
          type='submit'
          variant='flexColBtn'
          aria-label="Search"
          onButtonClick={() => handleSearch}
          className={clsx('text-[12px] space-x-1 md:py-0 bg-gray-800 sm:px-3', buttonStyle)}
          isLeftIcon
          icon={<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-10 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>}

        />
      }
    </form>
  );
};

export default SearchBar;
