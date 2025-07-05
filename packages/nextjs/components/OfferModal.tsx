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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync: submitOfferAsync } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const premiumInUSDC = parseUnits(premium, 6);

      await submitOfferAsync({
        functionName: "submitOffer",
        args: [BigInt(requestId), premiumInUSDC, description],
      });

      setPremium("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error submitting offer:", error);
    } finally {
      setIsSubmitting(false);
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
              className="input input-bordered w-full rounded-md focus:outline-none"
              value={premium}
              onChange={e => setPremium(e.target.value)}
              min="0"
              step="0.000001"
              required
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="block text-sm font-medium mb-2 text-beige-700">Description</label>
            <textarea
              className="textarea textarea-bordered h-24 rounded-md focus:outline-none"
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
            <button
              type="submit"
              className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none"
              disabled={isSubmitting || !premium}
            >
              {isSubmitting ? "Submitting..." : "Submit Offer"}
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
