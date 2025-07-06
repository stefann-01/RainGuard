"use client";

import { useState } from "react";
import { formatUSDCAmount } from "~~/app/utils/format.utils";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface PremiumPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  premiumAmount: number;
}

export const PremiumPaymentModal = ({ isOpen, onClose, requestId, premiumAmount }: PremiumPaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Contract write hooks
  const { writeContractAsync: payPremiumAsync } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  const { writeContractAsync: approveAsync } = useScaffoldWriteContract({
    contractName: "MockUSDC",
  });

  const handlePayPremium = async () => {
    try {
      setIsProcessing(true);

      // Convert premium amount to USDC decimals (6 decimals)
      const premiumAmountInWei = BigInt(Math.floor(premiumAmount));

      // First, approve USDC allowance for premium payment
      console.log("🔐 Approving USDC allowance for premium payment...");
      await approveAsync({
        functionName: "approve",
        args: ["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", premiumAmountInWei],
      });

      // Then pay the premium
      console.log("💰 Paying premium...");
      await payPremiumAsync({
        functionName: "payPremium",
        args: [BigInt(requestId), premiumAmountInWei],
      });

      console.log("✅ Premium paid successfully!");
      onClose();
    } catch (error) {
      console.error("Error paying premium:", error);
      alert("Failed to pay premium. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-2xl mb-6 text-beige-900">Pay Premium</h3>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-skyblue-50 to-beige-50 rounded-xl p-6 border border-skyblue-200">
            <h4 className="text-lg font-semibold text-beige-900 mb-4">Premium Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-beige-700">Premium Amount:</span>
                <span className="text-2xl font-bold text-skyblue-600">{formatUSDCAmount(premiumAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige-700">Expert Share (5%):</span>
                <span className="text-lg font-semibold text-orange-500">{formatUSDCAmount(premiumAmount * 0.05)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige-700">Investor Share (95%):</span>
                <span className="text-lg font-semibold text-green-600">{formatUSDCAmount(premiumAmount * 0.95)}</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-beige-600 bg-beige-50 rounded-lg p-4">
            <p className="font-semibold mb-2">What happens when you pay the premium:</p>
            <ul className="space-y-1">
              <li>• 5% goes to the expert who provided the offer</li>
              <li>• 95% is distributed to investors based on their contribution</li>
              <li>• The policy becomes active and coverage begins</li>
              <li>• The policy will be settled when the coverage period ends</li>
            </ul>
          </div>

          <button
            className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none w-full rounded-lg shadow-md font-semibold"
            onClick={handlePayPremium}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay Premium (${formatUSDCAmount(premiumAmount)})`}
          </button>
        </div>

        {/* Modal Actions */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-beige-900 opacity-20" onClick={onClose}></div>
    </div>
  );
};
