import { useState } from "react";
import { parseUnits } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface OfferModalProps {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferModal = ({ requestId, isOpen, onClose }: OfferModalProps) => {
  const [premium, setPremium] = useState("");
  const [description, setDescription] = useState("");

  const { writeContractAsync: submitOfferAsync } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert premium to USDC units (6 decimals)
      const premiumInUSDC = parseUnits(premium, 6);
      await submitOfferAsync({
        functionName: "submitOffer",
        args: [BigInt(requestId), premiumInUSDC, description],
      });

      // Reset form and close modal
      setPremium("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg mb-4">Submit Insurance Offer</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Premium Amount (USDC)</span>
            </label>
            <input
              type="number"
              placeholder="Enter premium amount"
              className="input input-bordered w-full"
              value={premium}
              onChange={e => setPremium(e.target.value)}
              min="0"
              step="0.000001"
              required
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter offer description and terms"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none">
              Submit Offer
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};
