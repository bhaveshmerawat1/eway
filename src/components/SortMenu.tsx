"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ChevronDown, ChevronUp } from "lucide-react";


// Shorting option 
const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "az", label: "Product Number (A to Z)" },
  { value: "za", label: "Product Number (Z to A)" },
];

export default function SortMenu() {
  const { sortBy, setSortBy } = useApp();
  const [open, setOpen] = useState(false);

  // Shorting handle function
  const handleSelect = (value: string) => {
    setSortBy(value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between rounded-full border border-gray-300 px-4 py-2 bg-white font-semibold text-[16px] text-color shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {" "}
        <span className="ml-2 font-semibold">
          {sortOptions.find((opt) => opt.value === sortBy)?.label || "Relevance"}
        </span>
        {open ? <ChevronUp className="ml-2 h-6 w-6" /> : <ChevronDown className="ml-2 h-6 w-6" />}
      </button>

      {/* Shorting options */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-sm bg-white shadow-lg z-10 border border-gray-light">
          <div className="p-2">
            {sortOptions.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => handleSelect(opt.value)}
              >
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={sortBy === opt.value}
                  onChange={() => handleSelect(opt.value)}
                  className="mr-3 accent-gray-600 w-[16px] h-[16px]"
                />
                <span className="text-[14px] font-semibold text-color">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
