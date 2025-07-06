"use client";

import { formatTimestamp, formatUSDCAmount } from "../../../../utils/format.utils";
import { ChevronLeft } from "lucide-react";
import { Address } from "~~/components/scaffold-eth";

export default function OfferPage() {
  // Mock data for the offer
  const mockOffer = {
    expert: "0x1234567890123456789012345678901234567890",
    premium: 5000,
    description:
      "This offer is based on historical weather data analysis and risk assessment. Our models suggest a 15% probability of the specified weather conditions occurring during the coverage period. The premium reflects this risk level and includes our standard service fee.",
    timestamp: new Date(),
    riskFactors: [
      { name: "Historical Occurrence", value: 75 },
      { name: "Seasonal Risk", value: 85 },
      { name: "Geographic Factor", value: 60 },
      { name: "Climate Trends", value: 70 },
    ],
    monthlyData: [
      { month: "Jan", risk: 65 },
      { month: "Feb", risk: 70 },
      { month: "Mar", risk: 75 },
      { month: "Apr", risk: 80 },
      { month: "May", risk: 85 },
      { month: "Jun", risk: 90 },
    ],
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-md h-12 rounded-lg shadow-md font-semibold px-6 flex items-center gap-2 mb-6"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Request
        </button>

        <div className="bg-gradient-to-r from-beige-50 to-skyblue-50 rounded-3xl p-8 border border-beige-200 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-beige-900 mb-2">Insurance Offer Details</h1>
              <div className="text-beige-600">Submitted {formatTimestamp(mockOffer.timestamp)}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-skyblue-600">{formatUSDCAmount(mockOffer.premium)}</div>
              <div className="text-beige-600">Premium</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-beige-900 mb-2">Expert</h2>
            <Address address={mockOffer.expert} format="long" />
          </div>

          <div className="bg-white rounded-xl p-4">
            <h2 className="font-semibold text-beige-900 mb-2">Offer Description</h2>
            <p className="text-beige-700 leading-relaxed">{mockOffer.description}</p>
          </div>
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Risk Factor Analysis</h2>
            <div className="space-y-4">
              {mockOffer.riskFactors.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-beige-700">{factor.name}</span>
                    <span className="text-sm text-beige-600">{factor.value}%</span>
                  </div>
                  <div className="w-full bg-beige-200 rounded-full h-2.5">
                    <div className="bg-skyblue-400 h-2.5 rounded-full" style={{ width: `${factor.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Risk Trends */}
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Monthly Risk Trends</h2>
            <div className="h-64 flex items-end justify-between">
              {mockOffer.monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-skyblue-400 rounded-t-lg transition-all duration-300 hover:bg-skyblue-500"
                    style={{ height: `${data.risk}%` }}
                  ></div>
                  <div className="mt-2 text-sm text-beige-600">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
