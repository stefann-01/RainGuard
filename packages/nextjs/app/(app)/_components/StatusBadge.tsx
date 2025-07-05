import { SensorStatus } from "~~/app/types";

interface StatusBadgeProps {
  status: SensorStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusConfig = (status: SensorStatus) => {
    switch (status) {
      case "Pending":
        return {
          color: "badge-warning",
          textColor: "text-yellow-800",
          text: "Pending",
        };
      case "Funding":
        return {
          color: "badge-info",
          textColor: "text-blue-800",
          text: "Funding",
        };
      case "Active":
        return {
          color: "badge-success",
          textColor: "text-green-800",
          text: "Active",
        };
      case "Expired":
        return {
          color: "badge-error",
          textColor: "text-red-800",
          text: "Expired",
        };
      case "Cancelled":
        return {
          color: "badge-neutral",
          textColor: "text-gray-800",
          text: "Cancelled",
        };
      default:
        return {
          color: "badge-warning",
          textColor: "text-yellow-800",
          text: "Pending",
        };
    }
  };
  const config = getStatusConfig(status);

  return (
    <div className={`badge ${config.color} ${config.textColor} ${className} rounded-xl border border-base-300`}>
      {config.text}
    </div>
  );
}
