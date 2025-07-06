"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatTimeRange, getWeatherTypeIcon } from "../../utils/format.utils";
import SearchBar from "../_components/SearchBar";
import StatusBadge from "../_components/StatusBadge";
import { useAccount } from "wagmi";
import { DEFAULT_SENSOR_STATUS, InsuranceRequest, SensorStatus } from "~~/app/types";
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
const RequestCard = ({ request }: { request: InsuranceRequest }) => {
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

export default function MyPage() {
  const { address: connectedAddress } = useAccount();
  const [showPast, setShowPast] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [userRequests, setUserRequests] = useState<InsuranceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get contract instance
  const { data: contract } = useScaffoldContract({ contractName: "InsuranceManager" });

  // Get all request IDs from the contract
  const { data: requestIds } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getAllRequestIds",
  });

  // Memoize the contract address to prevent unnecessary re-renders
  const contractAddress = useMemo(() => contract?.address, [contract?.address]);

  // Fetch all requests' data once and filter for current user
  const fetchUserRequests = useCallback(async () => {
    if (!requestIds || !connectedAddress || !contract) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const ids = requestIds.map((id: bigint) => Number(id));
      const lowerAddr = connectedAddress.toLowerCase();

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

            // Only process requests for the current user
            if (user.toLowerCase() !== lowerAddr) return null;

            // Fetch offers
            const offers = await contract.read.getOffers([BigInt(requestId)]);
            // Fetch investments
            const investments = await contract.read.getInvestments([BigInt(requestId)]);
            // Fetch conditions
            const conditions = await contract.read.getConditions([BigInt(requestId)]);

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
              conditions: (conditions || []).map((condition: any) => ({
                weatherType: Number(condition.weatherType),
                op: Number(condition.op),
                aggregateValue: Number(condition.aggregateValue),
                subThreshold: Number(condition.subThreshold),
                subOp: Number(condition.subOp),
              })),
              offers: (offers || []).map((offer: any) => ({
                id: Number(offer.id),
                expert: offer.expert,
                premium: Number(offer.premium),
                description: offer.description || "",
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

      const filteredRequests = requests.filter(Boolean) as InsuranceRequest[];
      setUserRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [requestIds, connectedAddress, contractAddress]);

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  // Compute user stats
  useEffect(() => {
    if (!userRequests || !connectedAddress) return;

    const totalRequests = userRequests.length;
    const activeRequests = userRequests.filter(r => r.status === 3).length;
    const totalFunded = userRequests.reduce((sum, r) => sum + (r.totalFunded || 0), 0);

    // Count expert offers (offers made by the current user in all requests)
    let totalOffers = 0;
    for (const req of userRequests) {
      totalOffers += req.offers.filter(
        (offer: any) => offer.expert?.toLowerCase() === connectedAddress.toLowerCase(),
      ).length;
    }

    setUserStats({ totalRequests, activeRequests, totalFunded, totalOffers });
  }, [userRequests, connectedAddress]);

  const handleShowPast = (showPast: boolean) => {
    setShowPast(showPast);
  };

  // Memoize filtered requests to prevent unnecessary re-renders
  const filteredRequests = useMemo(() => {
    return showPast ? userRequests : userRequests.filter(request => request.end > new Date());
  }, [userRequests, showPast]);

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
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-beige-900 mb-4">No Insurance Requests Found</h2>
            <p className="text-beige-700 mb-6">
              {showPast
                ? "You haven't created any insurance requests yet."
                : "You don't have any active insurance requests."}
            </p>
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
