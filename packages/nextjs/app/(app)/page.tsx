"use client";

import { useMemo, useState } from "react";
import { formatTimeRange } from "../utils/format.utils";
import SearchBar from "./_components/SearchBar";
import StatusBadge from "./_components/StatusBadge";
import { mockData } from "./mockdata";
import { DEFAULT_SENSOR_STATUS } from "~~/app/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [showPast, setShowPast] = useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const currentDate = new Date();

    // Filter by search query and past/future
    const filtered = mockData.filter(sensor => {
      const matchesSearch =
        sensor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (showPast) {
        return matchesSearch; // Show all if past is enabled
      } else {
        return matchesSearch && sensor.startDate > currentDate; // Only future if past is disabled
      }
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "description":
          return a.description.localeCompare(b.description);
        case "startDate":
        default:
          return a.startDate.getTime() - b.startDate.getTime();
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

  // Check if sensor has ended
  const hasEnded = (sensor: any) => {
    const currentDate = new Date();
    return sensor.endDate < currentDate;
  };

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Header */}
      <div className="px-48 pt-4">
        <h1 className="text-4xl font-bold text-beige-900 mb-2">RainGuard Dashboard</h1>
        <p className="text-beige-700">Monitor your rain sensors across the city</p>
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
          {filteredAndSortedData.map(sensor => {
            const formattedTime = formatTimeRange(sensor.startDate, sensor.endDate);
            const currentDate = new Date();
            const isPast = sensor.startDate < currentDate;
            const isEnded = hasEnded(sensor);

            return (
              <div
                key={sensor.id}
                className="card rounded-2xl bg-beige-50 border border-beige-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative"
              >
                <div className="card-body p-6">
                  <h2 className="card-title text-lg mb-2 text-beige-900">{sensor.title}</h2>
                  <p className="text-sm text-beige-700 mb-4">{sensor.description}</p>

                  <div className="mb-4">
                    <p className="text-sm">
                      <span className="font-semibold text-orange-600">{isPast ? "Started:" : "Starting:"}</span>{" "}
                      <span className="text-beige-800">{formattedTime.startDate}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-orange-600">Duration:</span>{" "}
                      <span className="text-beige-800">{formattedTime.lastingPeriod}</span>
                    </p>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm">
                      View Details
                    </button>
                  </div>
                  {/* Status Badge in bottom left */}
                  <div className="absolute left-6 bottom-6">
                    <StatusBadge status={isEnded ? "Expired" : sensor.status || DEFAULT_SENSOR_STATUS} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-beige-700 text-lg">No sensors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
