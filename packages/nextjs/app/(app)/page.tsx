"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatTimeRange, getWeatherTypeIcon } from "../utils/format.utils";
import SearchBar from "./_components/SearchBar";
import StatusBadge from "./_components/StatusBadge";
import { mockData } from "./mockdata";
import { DEFAULT_SENSOR_STATUS, SensorStatus } from "~~/app/types";

// Helper function to convert numeric status to string
const getStatusString = (numericStatus: number): SensorStatus => {
  switch (numericStatus) {
    case 0:
      return "Pending";
    case 1:
      return "Funding";
    case 2:
      return "Active";
    case 3:
      return "Expired";
    case 4:
      return "Cancelled";
    default:
      return DEFAULT_SENSOR_STATUS;
  }
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [showPast, setShowPast] = useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const currentDate = new Date();

    // Filter by search query and past/future
    const filtered = mockData.filter(request => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (showPast) {
        return matchesSearch; // Show all if past is enabled
      } else {
        return matchesSearch && request.start > currentDate; // Only future if past is disabled
      }
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "description":
          const aDesc = a.description || "";
          const bDesc = b.description || "";
          return aDesc.localeCompare(bDesc);
        case "startDate":
        default:
          return a.start.getTime() - b.start.getTime();
      }
    });

    return filtered;
  }, [searchQuery, sortBy, showPast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleShowPast = (showPast: boolean) => {
    setShowPast(showPast);
  };

  // Check if request has ended
  const hasEnded = (request: any) => {
    const currentDate = new Date();
    return request.end < currentDate;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-48 pt-4">
        <h1 className="text-4xl font-bold text-beige-900 mb-2">Dashboard</h1>
        <p className="text-beige-700">Protect your business with on-chain weather insurance coverage</p>
      </div>

      {/* Search and Filters */}
      <div className="px-48">
        <SearchBar
          onSearchAction={handleSearch}
          onSortAction={handleSort}
          onShowPastAction={handleShowPast}
          showPast={showPast}
        />
      </div>

      {/* Cards Grid */}
      <div className="px-48 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSortedData.map(request => {
            const formattedTime = formatTimeRange(request.start, request.end);
            const currentDate = new Date();
            const isPast = request.start < currentDate;
            const isEnded = hasEnded(request);
            const statusString = getStatusString(request.status);

            return (
              <div
                key={request.id}
                className="card rounded-2xl bg-beige-50 border border-beige-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative"
              >
                <div className="card-body py-3 px-4">
                  <h2 className="card-title text-lg mb-1 text-beige-900">
                    {request.conditions.length > 0 && getWeatherTypeIcon(request.conditions[0].weatherType)}{" "}
                    {request.title}
                  </h2>
                  <p className="text-sm text-beige-700 mb-2 line-clamp-3">
                    {request.description || "No description available"}
                  </p>

                  <div className="mb-2">
                    <p className="text-sm">
                      <span className="font-semibold text-orange-600">{isPast ? "Started:" : "Starting:"}</span>{" "}
                      <span className="text-beige-800">{formattedTime.startDate}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-orange-600">Duration:</span>{" "}
                      <span className="text-beige-800">{formattedTime.lastingPeriod}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-3">
                    <StatusBadge
                      status={isEnded ? "Expired" : statusString}
                      className="h-10 flex items-center rounded-lg border border-beige-300 bg-beige-200 text-beige-800 px-4"
                    />
                    <Link href={`/${request.id}`}>
                      <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm h-10 rounded-lg shadow-md font-semibold">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-beige-700 text-lg">No insurance requests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
