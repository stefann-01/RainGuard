"use client";

import { useState } from "react";
import { getWeatherTypeIcon } from "../app/utils/format.utils";
import { useAccount } from "wagmi";
import { Operator, WeatherType } from "~~/app/types";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WeatherConditionForm {
  weatherType: WeatherType;
  op: Operator;
  aggregateValue: number;
  subThreshold: number;
  subOp: Operator;
}

export default function CreateRequestModal({ isOpen, onClose }: CreateRequestModalProps) {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: writeInsuranceManagerAsync, isPending } = useScaffoldWriteContract({
    contractName: "InsuranceManager",
  });

  //revert to reset after dev
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [conditions, setConditions] = useState<WeatherConditionForm[]>([
    {
      weatherType: WeatherType.Rain, // RESET: Default weather type
      op: Operator.GreaterThan,
      aggregateValue: 0, // RESET: Default 50mm rain
      subThreshold: 10, // RESET: Default sub-threshold
      subOp: Operator.GreaterThan,
    },
  ]);

  const isConnected = !!connectedAddress;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConditionChange = (index: number, field: keyof WeatherConditionForm, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 0,
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  //revert to reset after dev
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      location: "",
      startDateTime: "",
      endDateTime: "",
    });
    setConditions([
      {
        weatherType: WeatherType.Rain, // RESET: Default weather type
        op: Operator.GreaterThan,
        aggregateValue: 0, // RESET: Default 50mm rain
        subThreshold: 10, // RESET: Default sub-threshold
        subOp: Operator.GreaterThan,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    // Validate form data
    if (!formData.title || !formData.amount || !formData.location || !formData.startDateTime || !formData.endDateTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Create the insurance request object
    const startDateTime = new Date(formData.startDateTime);
    const endDateTime = new Date(formData.endDateTime);

    // Convert conditions to contract format
    const contractConditions = conditions.map(condition => ({
      weatherType: condition.weatherType,
      op: condition.op,
      aggregateValue: BigInt(condition.aggregateValue),
      subThreshold: BigInt(condition.subThreshold),
      subOp: condition.subOp,
    }));

    try {
      await writeInsuranceManagerAsync({
        functionName: "createRequest",
        args: [
          formData.title,
          formData.description || "",
          BigInt(parseFloat(formData.amount) * 10 ** 6), // Convert to USDC decimals (6)
          contractConditions,
          formData.location,
          BigInt(Math.floor(startDateTime.getTime() / 1000)), // Convert to Unix timestamp
          BigInt(Math.floor(endDateTime.getTime() / 1000)), // Convert to Unix timestamp
        ],
      });

      alert("Request created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="w-full h-full flex items-center justify-center py-8 overflow-y-auto">
        <div className="modal-box max-w-4xl max-h-[calc(100vh-8rem)] bg-beige-50 border border-beige-200 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <span className="text-skyblue-600">🌦️</span>
              Create Insurance Request
            </h3>
            <button
              onClick={onClose}
              disabled={isPending}
              className="btn btn-circle btn-sm bg-beige-200 hover:bg-beige-300 text-beige-700 border-none"
            >
              ✕
            </button>
          </div>

          {!isConnected ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Connect Your Wallet</h3>
              <p className="text-neutral-700 mb-6">You need to connect your wallet to create an insurance request.</p>
              <button className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none btn-lg rounded-lg shadow-md font-semibold">
                Connect Wallet
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-neutral-900">Title *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleInputChange("title", e.target.value)}
                    className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                    placeholder="e.g., Downtown Rain Protection"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-neutral-900">Coverage Amount (USDC) *</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={e => handleInputChange("amount", e.target.value)}
                    className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                    placeholder="5000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold text-neutral-900">Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => handleInputChange("description", e.target.value)}
                  className="textarea textarea-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                  placeholder="Describe your insurance needs..."
                  rows={3}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold text-neutral-900">Location *</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => handleInputChange("location", e.target.value)}
                  className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                  placeholder="e.g., Downtown District, New York, NY"
                />
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-neutral-900">Start Date & Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={e => handleInputChange("startDateTime", e.target.value)}
                    className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-neutral-900">End Date & Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={e => handleInputChange("endDateTime", e.target.value)}
                    className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                    min={formData.startDateTime} // Prevent end time before start time
                  />
                </div>
              </div>

              {/* Weather Conditions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-neutral-900">Weather Conditions *</span>
                  </label>
                  <button
                    type="button"
                    onClick={addCondition}
                    className="btn btn-sm bg-orange-400 hover:bg-orange-500 text-white border-none rounded-lg"
                  >
                    + Add Condition
                  </button>
                </div>

                <div className="space-y-4">
                  {conditions.map((condition, index) => (
                    <div key={index} className="card bg-white border border-beige-300 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                          {getWeatherTypeIcon(condition.weatherType)} Condition {index + 1}
                        </h4>
                        {conditions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCondition(index)}
                            className="btn btn-sm btn-circle bg-red-100 hover:bg-red-200 text-red-600 border-none"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="label">
                            <span className="label-text text-sm text-neutral-700">Weather Type</span>
                          </label>
                          <select
                            value={condition.weatherType}
                            onChange={e => handleConditionChange(index, "weatherType", parseInt(e.target.value))}
                            className="select select-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                          >
                            <option value={WeatherType.Rain}>🌧️ Rain</option>
                            <option value={WeatherType.Wind}>💨 Wind</option>
                            <option value={WeatherType.Tornado}>🌪️ Tornado</option>
                            <option value={WeatherType.Flood}>🌊 Flood</option>
                            <option value={WeatherType.Hail}>🧊 Hail</option>
                          </select>
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text text-sm text-neutral-700">Operator</span>
                          </label>
                          <select
                            value={condition.op}
                            onChange={e => handleConditionChange(index, "op", parseInt(e.target.value))}
                            className="select select-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                          >
                            <option value={Operator.GreaterThan}>&gt; Greater Than</option>
                            <option value={Operator.LessThan}>&lt; Less Than</option>
                            <option value={Operator.Equal}>= Equal</option>
                          </select>
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text text-sm text-neutral-700">Value</span>
                          </label>
                          <input
                            type="number"
                            value={condition.aggregateValue}
                            onChange={e =>
                              handleConditionChange(index, "aggregateValue", parseFloat(e.target.value) || 0)
                            }
                            className="input input-bordered w-full bg-white border-beige-300 focus:border-skyblue-400 rounded-md focus:outline-none focus:ring-0 text-neutral-900"
                            placeholder="50"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requester Info */}
              <div className="bg-skyblue-50 rounded-xl p-4 border border-skyblue-200">
                <h4 className="font-semibold text-neutral-900 mb-2">Requester Information</h4>
                <Address address={connectedAddress!} format="long" />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="btn bg-beige-200 hover:bg-beige-300 text-beige-800 border-none rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn bg-skyblue-400 hover:bg-skyblue-500 text-white border-none rounded-lg shadow-md font-semibold"
                >
                  {isPending ? "Creating..." : "Create Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
