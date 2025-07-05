"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatTimeRange, getWeatherTypeIcon } from "../../utils/format.utils";
import SearchBar from "../_components/SearchBar";
import StatusBadge from "../_components/StatusBadge";
import { mockData } from "../mockdata";
import { useAccount } from "wagmi";
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

export default function MyPage() {
  const { address: connectedAddress } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [showPast, setShowPast] = useState(false);

  // Filter data to only show user's requests
  const userRequests = useMemo(() => {
    if (!connectedAddress) return [];

    return mockData.filter(request => request.user.toLowerCase() === connectedAddress.toLowerCase());
  }, [connectedAddress]);

  // Filter and sort user's data
  const filteredAndSortedData = useMemo(() => {
    const currentDate = new Date();

    // Filter by search query and past/future
    const filtered = userRequests.filter(request => {
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
  }, [userRequests, searchQuery, sortBy, showPast]);

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

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!userRequests.length) return null;

    const totalRequests = userRequests.length;
    const activeRequests = userRequests.filter(r => r.status === 2).length;
    const totalFunded = userRequests.reduce((sum, r) => sum + r.totalFunded, 0);
    const totalOffers = userRequests.reduce((sum, r) => sum + r.offers.length, 0);

    return {
      totalRequests,
      activeRequests,
      totalFunded,
      totalOffers,
    };
  }, [userRequests]);

  if (!connectedAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-beige-900 mb-4">Connect Your Wallet</h1>
          <p className="text-beige-700 mb-6">Please connect your wallet to view your insurance requests.</p>
          <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-lg rounded-lg shadow-md font-semibold">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-24 pt-4">
        <h1 className="text-4xl font-bold text-beige-900 mb-2">My Insurance Requests</h1>
        <p className="text-beige-700">Manage and track your weather insurance coverage</p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="px-24 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-r from-skyblue-50 to-beige-50 border border-skyblue-200 shadow-lg rounded-2xl">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-skyblue-600">{userStats.totalRequests}</div>
                <div className="text-beige-600">Total Requests</div>
              </div>
            </div>
            <div className="card bg-gradient-to-r from-green-50 to-beige-50 border border-green-200 shadow-lg rounded-2xl">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600">{userStats.activeRequests}</div>
                <div className="text-beige-600">Active Policies</div>
              </div>
            </div>
            <div className="card bg-gradient-to-r from-orange-50 to-beige-50 border border-orange-200 shadow-lg rounded-2xl">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-orange-600">${userStats.totalFunded.toLocaleString()}</div>
                <div className="text-beige-600">Total Funded</div>
              </div>
            </div>
            <div className="card bg-gradient-to-r from-purple-50 to-beige-50 border border-purple-200 shadow-lg rounded-2xl">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-purple-600">{userStats.totalOffers}</div>
                <div className="text-beige-600">Expert Offers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="px-24 mt-6">
        <SearchBar
          onSearchAction={handleSearch}
          onSortAction={handleSort}
          onShowPastAction={handleShowPast}
          showPast={showPast}
        />
      </div>

      {/* Cards Grid */}
      <div className="px-24 pb-8 mt-6">
        {filteredAndSortedData.length > 0 ? (
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

                    {/* Additional info for user's requests */}
                    <div className="mb-2 text-xs text-beige-600">
                      <p>Funded: ${request.totalFunded.toLocaleString()}</p>
                      <p>Offers: {request.offers.length}</p>
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
        ) : (
          <div className="text-center py-12">
            {userRequests.length === 0 ? (
              <>
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-beige-900 mb-4">No Requests Yet</h2>
                <p className="text-beige-700 mb-6">You haven&apos;t created any insurance requests yet.</p>
                <p className="text-beige-600">
                  Click the <span className="font-semibold text-skyblue-600">+</span> button in the navigation bar to
                  create your first request.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-beige-900 mb-4">No Matching Requests</h2>
                <p className="text-beige-700">Try adjusting your search criteria or filters.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
