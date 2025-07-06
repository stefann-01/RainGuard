"use client";

import { useState } from "react";
import CreateRequestModal from "../../../components/CreateRequestModal";
import { PlusIcon } from "lucide-react";

interface SearchBarProps {
  onSearchAction: (query: string) => void;
  onSortAction: (sortBy: string) => void;
  onShowPastAction: (showPast: boolean) => void;
  showPast: boolean;
}

export default function SearchBar({ onSearchAction, onSortAction, onShowPastAction, showPast }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between w-full mb-6">
        {/* Search Input */}
        <div className="w-full sm:max-w-xl">
          <div className="input-group flex flex-row">
            <input
              type="text"
              placeholder="Search sensors..."
              className="input bg-beige-50 border-beige-200 focus:border-skyblue-400 focus:outline-none text-beige-900 placeholder-beige-500 flex-1"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none ml-2">
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
            {/* Add Request Insurance Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn h-10 w-10 bg-skyblue-400 hover:bg-skyblue-500 text-white border-none flex items-center justify-center group relative overflow-hidden transition-all duration-500 hover:w-[180px] ml-2"
            >
              <PlusIcon className="h-6 w-6 absolute left-2" />
              <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
                Request Insurance
              </span>
            </button>
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-row gap-2 items-center">
          <select
            className="select bg-beige-50 border-beige-200 focus:border-skyblue-400 focus:outline-none text-beige-900 w-auto min-w-fit"
            onChange={handleSortChange}
            defaultValue="startDate"
          >
            <option value="startDate">Sort by Start Date</option>
            <option value="title">Sort by Title</option>
            <option value="description">Sort by Description</option>
          </select>
          <button
            className={`btn border-none ${
              showPast
                ? "bg-orange-400 hover:bg-orange-500 text-white"
                : "bg-beige-200 hover:bg-beige-300 text-orange-600"
            }`}
            onClick={handleShowPastToggle}
          >
            {showPast ? "Hide Past" : "Show Past"}
          </button>
        </div>
      </div>

      {/* Add CreateRequestModal */}
      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
}
