"use client";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Input from "../Inputs/Inputs";
import { FaSearch } from "react-icons/fa";
import { useProducts } from "@/context/ProductContext";

export default function ProductSearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  // const { searchResult } = useProducts();
  
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const delay = new Promise((res) => setTimeout(res, 1000));
        const [res] = await Promise.all([
          axios.get("/api/products/search", { params: { q: query } }),
          delay,
        ]);
        setSuggestions(res.data.products ?? []);
      } catch (err) {
        console.error("Search failed", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);


  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setLoading(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Save to history
  const handleSelect = (text: string) => {
    setQuery(text);
    setSuggestions([]);
    setHistory((prev) => {
      const newHist = [text, ...prev.filter((h) => h !== text)];
      return newHist.slice(0, 10);
    });
  };

  // Highlight matched part in recent search suggestion
  const renderHighlighted = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            part
          ) : (
            <span key={i} className="font-bold">{part}</span>
          )
        )}
      </>
    );
  };

  const handleDropdown = () =>{
    setLoading(true)
  }

  const filteredHistory =
      query.trim() === ""
        ? history
        : history.filter((h) => h.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <Input
        type="text"
        value={query}
        placeholder="Search product...."
        onChange={(e) => setQuery(e.target.value)}
        icon={<FaSearch />}
        inputStyle="!border-none"
        iconPosition="right"
        onFocus={handleDropdown}
      />
      {/* Dropdown - only show when focused + query/history exist */}
      {(loading || query || history.length > 0) && (
        <div
          ref={containerRef}
          className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg flex min-h-[200px] z-10"
        >
          {/* Left Column: Recent / Suggestions */}
          <div className="w-1/2 p-3 border-r border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Recent & Suggestions
            </p>
            {loading ? (
              <ul className="space-y-3 animate-pulse mt-3">
                {[...Array(4)].map((_, i) => (
                  <li key={i} className="h-4 bg-gray-200 rounded w-3/4" />
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {(filteredHistory.length > 0 ? filteredHistory : [query]).map((h, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSelect(h)}
                  >
                    {renderHighlighted(h, query)}
                  </li>
                ))} 
              </ul>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="w-1/2 p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-500">
                Top results {query && `for "${query}"`}
              </p>
            </div>

            {loading ? (
              <ul className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : suggestions.length > 0 ? (
              <ul className="space-y-3">
                {suggestions.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center space-x-3 hover:bg-gray-50 cursor-pointer p-1 rounded"
                    onClick={() => handleSelect(p.name)}
                  >
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                    )}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        ${p.price} {p.color && `• ${p.color}`} {p.size && `• ${p.size}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No results</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

