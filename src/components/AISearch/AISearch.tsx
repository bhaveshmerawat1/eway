"use client";

import React, { useState } from "react";
import axios from "axios";
import Input from "../Inputs/Inputs";
import Loader from "../Loader/Loader";
import { FaSearch } from "react-icons/fa";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState("")
  const [searchError, setSearchError]= useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/ai", { query });
      setSearchResult(res.data.answer);
    } catch (err: any) {
      setSearchError(err.response?.data || err.message)
      console.error("Search error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="relative w-4xl"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI anything..."
          inputStyle=""
          iconPosition="right"
          buttonType="submit"
          icon={loading ? <Loader data-testid="loader" size="sm" isLoading={loading} /> : <FaSearch className="text-sm" />}
          isErrorMessage={searchError}
          isErrors={searchError.length >=1}
        />
      </form>
      <div className="relative w-4xl py-4">
        <p className="text-md text-gray-700 font-normal">{searchResult}</p>
      </div>
    </>
  );
}
