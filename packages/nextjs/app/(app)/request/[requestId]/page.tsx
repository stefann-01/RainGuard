"use client";

import { use, useState } from "react";
import {
  formatTimeRange,
  formatTimestamp,
  formatUSDCAmount,
  getOperatorName,
  getWeatherTypeIcon,
  getWeatherTypeName,
} from "../../../utils/format.utils";
import StatusBadge from "../../_components/StatusBadge";
import { ChevronLeft } from "lucide-react";
import { useAccount } from "wagmi";
import {
  DEFAULT_SENSOR_STATUS,
  InsuranceRequest,
  Investment,
  Offer,
  SensorStatus,
  WeatherCondition,
  WeatherType,
} from "~~/app/types";
import { OfferModal } from "~~/components/OfferModal";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

interface RequestDetailsPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

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

export default function RequestDetailsPage({ params }: RequestDetailsPageProps) {
  const resolvedParams = use(params);
  const requestId = resolvedParams.requestId;

  const { address: connectedAddress } = useAccount();
  const [fundAmount, setFundAmount] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [visibleOffers, setVisibleOffers] = useState(2);

  // Fetch basic request data
  const { data: basicData, isLoading: basicLoading } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getRequestBasic",
    args: [BigInt(requestId)],
  });

  // Fetch conditions
  const { data: conditions } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getConditions",
    args: [BigInt(requestId)],
  });

  // Fetch offers
  const { data: offers } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getOffers",
    args: [BigInt(requestId)],
  });

  // Fetch investments
  const { data: investments } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getInvestments",
    args: [BigInt(requestId)],
  });

  if (basicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-beige-700">Loading request details...</p>
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
    basicData || [];

  const request: InsuranceRequest = {
    id: Number(id || 0),
    title: title || "",
    description: description || "",
    user: user || "",
    amount: Number(amount || 0),
    conditions: convertedConditions,
    location: location || "",
    start: new Date(Number(start || 0) * 1000),
    end: new Date(Number(end || 0) * 1000),
    status: Number(status || 0),
    offers: convertedOffers,
    selectedOffer: Number(selectedOffer || 0),
    investments: convertedInvestments,
    totalFunded: Number(totalFunded || 0),
    payout: payout || false,
    timestamp: new Date(),
  };

  const formattedTime = formatTimeRange(request.start, request.end);
  const currentDate = new Date();
  const isPast = request.start < currentDate;
  const isEnded = request.end < currentDate;
  const statusString = getStatusString(request.status);

  // Funding goal is the request amount
  const fundingGoal = request.amount;
  const fundingProgress = fundingGoal > 0 ? Math.round((request.totalFunded / fundingGoal) * 100) : 0;

  // Check if the connected user is the requester
  const isRequester = connectedAddress && connectedAddress.toLowerCase() === request.user.toLowerCase();

  // Check if user is connected
  const isConnected = !!connectedAddress;

  // Calculate remaining funding needed
  const remainingFunding = fundingGoal - request.totalFunded;

  return (
    <div className="min-h-screen py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-md h-12 rounded-lg shadow-md font-semibold px-6 flex items-center gap-2"
            onClick={() => (window.location.href = "/")}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <StatusBadge
            status={isEnded ? "Expired" : statusString}
            className="h-12 flex items-center rounded-lg border border-beige-300 bg-beige-200 text-beige-800 px-6"
          />
        </div>

        <div className="bg-gradient-to-r from-beige-50 to-skyblue-50 rounded-3xl p-8 border border-beige-200 shadow-xl">
          <h1 className="text-5xl font-bold text-beige-900 mb-4">{request.title}</h1>
          <p className="text-xl text-beige-700 mb-6">{request.description || "No description available"}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-skyblue-600">{formatUSDCAmount(request.amount)}</div>
              <div className="text-beige-600">Coverage Amount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{request.conditions.length}</div>
              <div className="text-beige-600">Weather Conditions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-skyblue-600">{request.offers.length}</div>
              <div className="text-beige-600">Expert Offers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requester Information */}
          <div className="card bg-beige-50 border border-beige-200 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-beige-900 mb-4 flex items-center gap-3">
                <span className="text-skyblue-600">👤</span>
                Requester Information
              </h2>
              <div className="bg-white rounded-xl p-4 border border-beige-300">
                <Address address={request.user} format="long" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card bg-beige-50 border border-beige-200 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-beige-900 mb-4 flex items-center gap-3">
                <span className="text-skyblue-600">📍</span>
                Location
              </h2>
              <div className="bg-white rounded-xl p-4 border border-beige-300">
                <p className="text-lg text-beige-800 font-medium">{request.location}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card bg-beige-50 border border-beige-200 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-beige-900 mb-4 flex items-center gap-3">
                <span className="text-skyblue-600">📅</span>
                Coverage Schedule
              </h2>
              <div className="bg-white rounded-xl p-4 border border-beige-300 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-400">{isPast ? "Started:" : "Starting:"}</span>
                  <span className="text-beige-800 font-medium">{formattedTime.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-400">Duration:</span>
                  <span className="text-beige-800 font-medium">{formattedTime.lastingPeriod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-400">Ends:</span>
                  <span className="text-beige-800 font-medium">{formattedTime.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="card bg-beige-50 border border-beige-200 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-beige-900 mb-4 flex items-center gap-3">
                <span className="text-skyblue-600">🌦️</span>
                Weather Conditions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border border-beige-300 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getWeatherTypeIcon(condition.weatherType)}</span>
                      <h3 className="font-bold text-beige-900">{getWeatherTypeName(condition.weatherType)}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-orange-600 font-semibold">Trigger:</span>
                        <span className="text-beige-800">
                          {getOperatorName(condition.op)} {condition.aggregateValue}
                          {condition.weatherType === WeatherType.Rain && " mm"}
                          {condition.weatherType === WeatherType.Wind && " hours"}
                          {condition.weatherType === WeatherType.Hail && " hours"}
                        </span>
                      </div>
                      {condition.subThreshold > 0 && (
                        <div className="flex justify-between">
                          <span className="text-orange-600 font-semibold">Sub-condition:</span>
                          <span className="text-beige-800">
                            {getOperatorName(condition.subOp)} {condition.subThreshold}
                            {condition.weatherType === WeatherType.Wind && " km/h"}
                            {condition.weatherType === WeatherType.Hail && " mm"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pool & Offers */}
        <div className="space-y-6">
          {/* Expert Offers */}
          <div className="card bg-beige-50 border border-beige-200 shadow-xl rounded-2xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-2xl font-bold text-beige-900 flex items-center gap-3">
                  <span className="text-skyblue-600">👨‍💼</span>
                  Expert Offers ({request.offers.length})
                </h2>
                <button
                  className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm rounded-lg shadow-md font-semibold"
                  onClick={() => setIsOfferModalOpen(true)}
                >
                  Provide Offer
                </button>
              </div>

              <div className="space-y-4">
                {request.offers.slice(0, visibleOffers).map((offer, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-beige-300 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-beige-900 mb-2">Expert #{index + 1}</h3>
                        <div className="bg-beige-100 rounded-lg p-2">
                          <Address address={offer.expert} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-skyblue-600">{formatUSDCAmount(offer.premium)}</div>
                        <div className="text-sm text-beige-600">Premium</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-beige-600">Offered: {formatTimestamp(offer.timestamp)}</div>
                    </div>

                    <button
                      className={`btn border-none btn-sm rounded-lg shadow-md font-semibold w-full ${
                        isRequester
                          ? "bg-skyblue-400 hover:bg-skyblue-500 text-white"
                          : "bg-beige-300 text-beige-600 cursor-not-allowed"
                      }`}
                      disabled={!isRequester}
                    >
                      {isRequester ? "Accept Offer" : "Only Requester Can Accept"}
                    </button>
                  </div>
                ))}

                <div className="text-center pt-2 flex justify-center gap-2">
                  {request.offers.length > visibleOffers && (
                    <button
                      className="btn btn-ghost btn-sm text-skyblue-600"
                      onClick={() => setVisibleOffers(prev => prev + 2)}
                    >
                      Show More Offers ({request.offers.length - visibleOffers} remaining)
                    </button>
                  )}
                  {visibleOffers > 2 && (
                    <button className="btn btn-ghost btn-sm text-orange-400" onClick={() => setVisibleOffers(2)}>
                      Show Less
                    </button>
                  )}
                </div>

                {request.offers.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🤝</div>
                    <p className="text-beige-700">No offers yet.</p>
                    <p className="text-sm text-beige-600 mt-2">Experts can submit offers to provide coverage.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Funding Pool - Highlighted */}
          <div className="card bg-gradient-to-br from-skyblue-50 to-beige-50 border-2 border-skyblue-200 shadow-2xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-beige-900 mb-4 flex items-center gap-3">
                <span className="text-skyblue-600">💰</span>
                Funding Pool
              </h2>

              <div className="bg-white rounded-xl p-4 border border-skyblue-300 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-skyblue-600 mb-2">{fundingProgress}%</div>
                  <div className="w-full bg-beige-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-skyblue-400 to-skyblue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-beige-900">{formatUSDCAmount(request.totalFunded)}</div>
                    <div className="text-sm text-beige-600">Funded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-beige-900">{formatUSDCAmount(fundingGoal)}</div>
                    <div className="text-sm text-beige-600">Goal</div>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`badge ${request.status === 2 ? "bg-green-100 text-green-800" : "bg-beige-200 text-beige-800"} border-none font-medium`}
                  >
                    {request.status === 2 ? "🟢 Active" : "⚪ Inactive"}
                  </div>
                </div>

                {/* Fund Pool Section */}
                <div className="mt-6 pt-6 border-t border-skyblue-200">
                  <h3 className="text-lg font-semibold text-beige-900 mb-4 text-center">Fund This Pool</h3>

                  {!isConnected ? (
                    <div className="text-center">
                      <p className="text-beige-600 mb-3">Connect your wallet to fund this pool</p>
                      <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-sm rounded-lg shadow-md font-semibold">
                        Connect Wallet
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-beige-700 mb-2 block">
                          Amount to contribute (ETH)
                        </label>
                        <EtherInput value={fundAmount} onChange={setFundAmount} placeholder="0.0" />
                      </div>

                      <div className="text-center text-sm text-beige-600">
                        <p>
                          Remaining: {remainingFunding > 0 ? `$${remainingFunding.toLocaleString()}` : "Fully funded!"}
                        </p>
                      </div>

                      <button
                        className={`btn border-none btn-sm rounded-lg shadow-md font-semibold w-full ${
                          fundAmount && parseFloat(fundAmount) > 0 && remainingFunding > 0
                            ? "bg-orange-400 hover:bg-orange-500 text-white"
                            : "bg-beige-300 text-beige-600 cursor-not-allowed"
                        }`}
                        disabled={!fundAmount || parseFloat(fundAmount) <= 0 || remainingFunding <= 0}
                      >
                        {remainingFunding <= 0
                          ? "Pool Fully Funded"
                          : fundAmount && parseFloat(fundAmount) > 0
                            ? "Fund Pool"
                            : "Enter Amount"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the OfferModal */}
      <OfferModal requestId={requestId} isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} />
    </div>
  );
}
