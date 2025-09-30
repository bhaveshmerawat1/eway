"use client";

import React, { useState } from "react";
import axios from "axios";
import Input from "../Inputs/Inputs";
import Loader from "../Loader/Loader";
import { FaSearch } from "react-icons/fa";
import Button from "../Button/Button";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [searchError, setSearchError] = useState("");
  const [language, setLanguage] = useState("English");

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

  const handleTranslate = async () => {
    if (!searchResult) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/translate", { text:searchResult, targetLang: language });
      console.log("res data ============", res.data)
      setSearchResult(res.data.translated);
    } catch (err: any) {
      setLoading(false);
      setSearchResult("Error translating text.");
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
          isErrors={searchError.length >= 1}
        />
      </form>
      <div className="relative w-4xl py-4">
        <div className="flex items-center  pb-4 space-x-2">
          <select
            className="flex items-center justify-center gap-0 px-3 py-2 group transition-all duration-400 ease-in-out w-full max-w-max relative border border-[#7b4cf2] bg-white rounded-sm text-[#7b4cf2] hover:bg-[#7b4cf2] hover:text-white outline-none cursor"
            value={language}
            onChange={(e) => {
              console.log("sleacted language ============", e.target.value)
              setLanguage(e.target.value)
            }
            }
          >
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Hindi</option>
            <option>Japanese</option>
            <option>English</option>
          </select>

          <Button
            children={"Transilate"}
            disabled={loading}
            type="button"
            onClick={handleTranslate}
          />
        </div>
        <p className="text-md text-gray-700 font-normal">{searchResult}</p>
      </div>
    </>
  );
}
