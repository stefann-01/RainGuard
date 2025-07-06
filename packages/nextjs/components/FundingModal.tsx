"use client";

import { useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { formatUSDCAmount } from "~~/app/utils/format.utils";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  remainingFunding: number;
}

export const FundingModal = ({ isOpen, onClose, requestId, remainingFunding }: FundingModalProps) => {
  const [fundAmount, setFundAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Read request status
  const { data: requestData } = useScaffoldReadContract({
    contractName: "InsuranceManager",
    functionName: "getRequestBasic",
    args: [BigInt(requestId)],
  });

  const status = requestData ? Number(requestData[8]) : 0; // status is the 9th element in the tuple

  // Contract write hooks
  const { writeContractAsync: fundPoolAsync } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  const { writeContractAsync: approveAsync } = useScaffoldWriteContract({
    contractName: "MockUSDC",
  });

  const handleFund = async () => {
    if (!fundAmount || status !== 1) return; // Only allow funding in status 1 (funding phase)
    const amount = BigInt(Math.floor(parseFloat(fundAmount) * 1e6));

    try {
      setIsProcessing(true);
      await approveAsync({
        functionName: "approve",
        args: ["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", amount],
      });

      await fundPoolAsync({
        functionName: "fundPool",
        args: [BigInt(requestId), amount],
      });
      onClose();
    } catch (error) {
      console.error("Error funding pool:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add status warning if not in funding phase
  const statusWarning =
    status !== 1 ? (
      <p className="text-sm text-red-500 mt-2">
        This request is not in funding phase. Only requests with selected offers can be funded.
      </p>
    ) : null;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-2xl mb-6 text-beige-900">Fund Insurance Pool</h3>
        {statusWarning}

        {/* Funding Amount */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-beige-700 mb-2 block">Amount to contribute (USDC)</label>
            <EtherInput value={fundAmount} onChange={setFundAmount} placeholder="0.0" />
            <p className="text-sm text-beige-600 mt-2">Remaining to fund: {formatUSDCAmount(remainingFunding)}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-semibold text-beige-800">Payment Methods</h4>

            {/* USDC Payment */}
            <button
              className={`btn w-full ${
                fundAmount && parseFloat(fundAmount) > 0 && status === 1
                  ? "bg-orange-400 hover:bg-orange-500 text-white"
                  : "bg-beige-300 text-beige-600"
              }`}
              disabled={!fundAmount || parseFloat(fundAmount) <= 0 || isProcessing || status !== 1}
              onClick={handleFund}
            >
              {isProcessing ? "Processing..." : status !== 1 ? "Not in Funding Phase" : "Pay with USDC"}
            </button>

            {/* Credit Card - Disabled */}
            <button className="btn w-full bg-beige-100 text-beige-500 cursor-not-allowed" disabled>
              💳 Pay with Credit Card (Coming Soon)
            </button>

            {/* PayPal - Disabled */}
            <button className="btn w-full bg-beige-100 text-beige-500 cursor-not-allowed" disabled>
              <span className="text-[#00457C] font-bold">Pay</span>
              <span className="text-[#0079C1] font-bold">Pal</span>
              &nbsp;(Coming Soon)
            </button>
          </div>
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
