"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatTimeRange, getWeatherTypeIcon } from "../utils/format.utils";
import SearchBar from "./_components/SearchBar";
import StatusBadge from "./_components/StatusBadge";
import {
  DEFAULT_SENSOR_STATUS,
  InsuranceRequest,
  Investment,
  Offer,
  SensorStatus,
  WeatherCondition,
} from "~~/app/types";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

// Helper function to convert numeric status to string
const getStatusString = (numericStatus: number): SensorStatus => {
  switch (numericStatus) {
    case 0:
      return "Pending";
    case 1:
      return "Funding";
    case 2:
      return "Premium Payment";
    case 3:
      return "Active";
    case 4:
      return "Expired";
    default:
      return DEFAULT_SENSOR_STATUS;
  }
};

// Component to render a single request card
const RequestCard = ({ requestId }: { requestId: number }) => {
  const { data: basicData } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getRequestBasic",
    args: [BigInt(requestId)],
  });

  const { data: conditions } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getConditions",
    args: [BigInt(requestId)],
  });

  const { data: offers } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getOffers",
    args: [BigInt(requestId)],
  });

  const { data: investments } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getInvestments",
    args: [BigInt(requestId)],
  });

  if (!basicData) {
    return (
      <div className="card rounded-2xl bg-beige-50 border border-beige-200 shadow-xl">
        <div className="card-body py-3 px-4">
          <div className="loading loading-spinner loading-sm"></div>
          <p className="text-sm text-beige-700">Loading request {requestId}...</p>
        </div>
      </div>
    );
  }

  // Convert Solidity data to TypeScript types
  const convertedConditions: WeatherCondition[] = (conditions || []).map((condition: any) => ({
    weatherType: Number(condition.weatherType),
    op: Number(condition.op),
    aggregateValue: Number(condition.aggregateValue),
    subThreshold: Number(condition.subThreshold),
    subOp: Number(condition.subOp),
  }));

  const convertedOffers: Offer[] = (offers || []).map((offer: any) => ({
    id: Number(offer.id),
    expert: offer.expert,
    premium: Number(offer.premium),
    description: offer.description,
    timestamp: new Date(Number(offer.timestamp) * 1000),
  }));

  const convertedInvestments: Investment[] = (investments || []).map((investment: any) => ({
    investor: investment.investor,
    amount: Number(investment.amount),
  }));

  // Destructure the tuple returned by getRequestBasic
  const [id, title, description, user, amount, location, start, end, status, totalFunded, payout, selectedOffer] =
    basicData;

  const request: InsuranceRequest = {
    id: Number(id),
    title,
    description,
    user,
    amount: Number(amount),
    conditions: convertedConditions,
    location,
    start: new Date(Number(start) * 1000),
    end: new Date(Number(end) * 1000),
    status: Number(status),
    offers: convertedOffers,
    selectedOffer: Number(selectedOffer),
    investments: convertedInvestments,
    totalFunded: Number(totalFunded),
    payout,
    timestamp: new Date(),
  };

  const formattedTime = formatTimeRange(request.start, request.end);
  const currentDate = new Date();
  const isPast = request.start < currentDate;
  const isEnded = request.end < currentDate;
  const statusString = getStatusString(request.status);

  return (
    <div className="card rounded-2xl bg-beige-50 border border-beige-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
      <div className="card-body py-3 px-4">
        <h2 className="card-title text-lg mb-1 text-beige-900">
          {request.conditions.length > 0 && getWeatherTypeIcon(request.conditions[0].weatherType)} {request.title}
        </h2>
        <p className="text-sm text-beige-700 mb-2 line-clamp-3">{request.description || "No description available"}</p>

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
          <Link href={`/request/${request.id}`}>
            <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm h-10 rounded-lg shadow-md font-semibold">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [showPast, setShowPast] = useState(false);

  // Get all request IDs from the contract
  const { data: requestIds, isLoading } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getAllRequestIds",
  });

  // Filter and sort request IDs based on search criteria
  const filteredRequestIds = useMemo(() => {
    if (!requestIds || isLoading) return [];

    // For now, we'll show all requests since filtering requires fetching each request's data
    // In a production app, you might want to implement server-side filtering or caching
    return requestIds.map((id: bigint) => Number(id));
  }, [requestIds, isLoading, searchQuery, sortBy, showPast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleShowPast = (showPast: boolean) => {
    setShowPast(showPast);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-beige-700">Loading insurance requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-24 pt-4">
        <h1 className="text-4xl font-bold text-beige-900 mb-2">Dashboard</h1>
        <p className="text-beige-700">Protect your business with on-chain weather insurance coverage</p>
      </div>

      {/* Search and Filters */}
      <div className="px-24">
        <SearchBar
          onSearchAction={handleSearch}
          onSortAction={handleSort}
          onShowPastAction={handleShowPast}
          showPast={showPast}
        />
      </div>

      {/* Cards Grid */}
      <div className="px-24 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredRequestIds.map(requestId => (
            <RequestCard key={requestId} requestId={requestId} />
          ))}
        </div>

        {/* No results message */}
        {filteredRequestIds.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-beige-700 text-lg">No insurance requests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
