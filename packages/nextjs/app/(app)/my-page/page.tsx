"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTimeRange, getWeatherTypeIcon } from "../../utils/format.utils";
import SearchBar from "../_components/SearchBar";
import StatusBadge from "../_components/StatusBadge";
import { useAccount } from "wagmi";
import {
  DEFAULT_SENSOR_STATUS,
  InsuranceRequest,
  Investment,
  Offer,
  SensorStatus,
  WeatherCondition,
} from "~~/app/types";
import { useScaffoldContract } from "~~/hooks/scaffold-eth/useScaffoldContract";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

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
    description: offer.description || "", // Add description with fallback
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
          <Link href={`/${request.id}`}>
            <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm h-10 rounded-lg shadow-md font-semibold">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function MyPage() {
  const { address: connectedAddress } = useAccount();
  // const [searchQuery, setSearchQuery] = useState("");
  // const [sortBy, setSortBy] = useState("startDate");
  const [showPast, setShowPast] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [allRequests, setAllRequests] = useState<InsuranceRequest[]>([]);

  // Get contract instance
  const { data: contract } = useScaffoldContract({ contractName: "InsuranceManager" });

  // Get all request IDs from the contract
  const { data: requestIds, isLoading } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getAllRequestIds",
  });

  // Fetch all requests' data in parent
  useEffect(() => {
    if (!requestIds || !connectedAddress || !contract) return;
    const fetchAllRequests = async () => {
      const ids = requestIds.map((id: bigint) => Number(id));
      const requests = await Promise.all(
        ids.map(async (requestId: number) => {
          try {
            // Fetch basic data
            const basicData = await contract.read.getRequestBasic([BigInt(requestId)]);
            if (!basicData) return null;
            const [
              id,
              title,
              description,
              user,
              amount,
              location,
              start,
              end,
              status,
              totalFunded,
              payout,
              selectedOffer,
            ] = basicData;
            // Fetch offers
            const offers = await contract.read.getOffers([BigInt(requestId)]);
            // Fetch investments
            const investments = await contract.read.getInvestments([BigInt(requestId)]);
            return {
              id: Number(id),
              title,
              description,
              user,
              amount: Number(amount),
              location,
              start: new Date(Number(start) * 1000),
              end: new Date(Number(end) * 1000),
              status: Number(status),
              offers: (offers || []).map((offer: any) => ({
                expert: offer.expert,
                premium: Number(offer.premium),
                description: offer.description || "", // Add description with fallback
                timestamp: new Date(Number(offer.timestamp) * 1000),
              })),
              selectedOffer: Number(selectedOffer || 0),
              investments: (investments || []).map((investment: any) => ({
                investor: investment.investor,
                amount: Number(investment.amount),
              })),
              totalFunded: Number(totalFunded),
              payout,
              timestamp: new Date(),
            };
          } catch (error) {
            console.error(`Error fetching request ${requestId}:`, error);
            return null;
          }
        }),
      );
      setAllRequests(requests.filter(Boolean) as InsuranceRequest[]);
    };
    fetchAllRequests();
  }, [requestIds, connectedAddress, contract]);

  // Compute user stats
  useEffect(() => {
    if (!allRequests || !connectedAddress) return;
    const lowerAddr = connectedAddress.toLowerCase();
    const userRequests = allRequests.filter(r => r.user?.toLowerCase() === lowerAddr);
    const totalRequests = userRequests.length;
    const activeRequests = userRequests.filter(r => r.status === 2).length;
    const totalFunded = userRequests.reduce((sum, r) => sum + (r.totalFunded || 0), 0);
    // Expert offers: offers in all requests where expert is the user
    let totalOffers = 0;
    for (const req of allRequests) {
      totalOffers += req.offers.filter((offer: any) => offer.expert?.toLowerCase() === lowerAddr).length;
    }
    setUserStats({ totalRequests, activeRequests, totalFunded, totalOffers });
  }, [allRequests, connectedAddress]);

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  // const handleSort = (sortBy: string) => {
  //   setSortBy(sortBy);
  // };

  const handleShowPast = (showPast: boolean) => {
    setShowPast(showPast);
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-beige-700">Loading your insurance requests...</p>
        </div>
      </div>
    );
  }

  // Render user stats at the top
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
          onSearchAction={() => {}}
          onSortAction={() => {}}
          onShowPastAction={handleShowPast}
          showPast={showPast}
        />
      </div>

      {/* Cards Grid */}
      <div className="px-24 pb-8 mt-6">
        {allRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allRequests.map(request => (
              <RequestCard key={request.id} requestId={request.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-beige-900 mb-4">No Insurance Requests Found</h2>
            <p className="text-beige-700 mb-6">You haven&apos;t created any insurance requests yet.</p>
            <Link href="/">
              <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-lg rounded-lg shadow-md font-semibold">
                Browse All Requests
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
