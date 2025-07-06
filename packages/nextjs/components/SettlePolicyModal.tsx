"use client";

import { useState } from "react";
import { formatUSDCAmount } from "~~/app/utils/format.utils";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface SettlePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  coverageAmount: number;
  payout: boolean | null; // null = not settled yet, true/false = settlement result
}

export const SettlePolicyModal = ({ isOpen, onClose, requestId, coverageAmount, payout }: SettlePolicyModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [settlementResult, setSettlementResult] = useState<boolean | null>(payout);

  // Contract write hook
  const { writeContractAsync: settlePolicyAsync } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  const handleSettlePolicy = async () => {
    try {
      setIsProcessing(true);

      console.log("🔍 Settling policy...");
      await settlePolicyAsync({
        functionName: "settlePolicy",
        args: [BigInt(requestId)],
      });

      console.log("✅ Policy settled successfully!");
      setSettlementResult(true); // This will be updated by the contract call
      onClose();
    } catch (error) {
      console.error("Error settling policy:", error);
      alert("Failed to settle policy. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-2xl mb-6 text-beige-900">Settle Policy</h3>

        <div className="space-y-6">
          {settlementResult === null ? (
            // Not settled yet
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-beige-50 rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-beige-900 mb-4">Policy Settlement</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-beige-700">Coverage Amount:</span>
                    <span className="text-2xl font-bold text-skyblue-600">{formatUSDCAmount(coverageAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-beige-700">Status:</span>
                    <span className="badge bg-orange-100 text-orange-800 border-none">Ready to Settle</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-beige-600 bg-beige-50 rounded-lg p-4">
                <p className="font-semibold mb-2">What happens when you settle:</p>
                <ul className="space-y-1">
                  <li>• Oracle data is checked against weather conditions</li>
                  <li>• If conditions are met, payout is made to the requester</li>
                  <li>• If conditions are not met, investors can withdraw their funds</li>
                  <li>• Expert reputation is updated based on the outcome</li>
                </ul>
              </div>

              <button
                className="btn bg-orange-400 hover:bg-orange-500 text-white border-none w-full rounded-lg shadow-md font-semibold"
                onClick={handleSettlePolicy}
                disabled={isProcessing}
              >
                {isProcessing ? "Settling..." : "Settle Policy"}
              </button>
            </div>
          ) : (
            // Already settled
            <div className="space-y-4">
              <div
                className={`rounded-xl p-6 border ${
                  settlementResult ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <h4 className="text-lg font-semibold text-beige-900 mb-4">Settlement Result</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-beige-700">Coverage Amount:</span>
                    <span className="text-2xl font-bold text-skyblue-600">{formatUSDCAmount(coverageAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-beige-700">Payout:</span>
                    <span
                      className={`badge ${
                        settlementResult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      } border-none`}
                    >
                      {settlementResult ? "✅ Paid" : "❌ Not Paid"}
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-beige-600">
                      {settlementResult
                        ? "Weather conditions were met. Payout has been made to the requester."
                        : "Weather conditions were not met. No payout was made."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={isProcessing}>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-beige-900 opacity-20" onClick={onClose}></div>
    </div>
  );
};
