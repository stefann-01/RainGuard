"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearchAction: (query: string) => void;
  onSortAction: (sortBy: string) => void;
  onShowPastAction: (showPast: boolean) => void;
  showPast: boolean;
}

export default function SearchBar({ onSearchAction, onSortAction, onShowPastAction, showPast }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchAction(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortAction(e.target.value);
  };

  const handleShowPastToggle = () => {
    onShowPastAction(!showPast);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between w-full mb-6 pr-9">
      {/* Search Input */}
      <div className="w-full">
        <div className="flex flex-row items-center">
          <input
            type="text"
            placeholder="Search sensors..."
            className="input input-bordered flex-1 focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary btn-square mx-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-row gap-2 items-center">
        <select
          className="select select-bordered w-auto min-w-fit focus:outline-none"
          onChange={handleSortChange}
          defaultValue="startDate"
        >
          <option value="startDate">Sort by Start Date</option>
          <option value="title">Sort by Title</option>
          <option value="description">Sort by Description</option>
        </select>
        <button className={`btn ${showPast ? "btn-primary" : "btn-outline"}`} onClick={handleShowPastToggle}>
          {showPast ? "Hide Past" : "Show Past"}
        </button>
      </div>
    </div>
  );
}
