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
          bgColor: "bg-beige-200",
          textColor: "text-beige-800",
          text: "Pending",
        };
      case "Funding":
        return {
          bgColor: "bg-skyblue-100",
          textColor: "text-skyblue-700",
          text: "Funding",
        };
      case "Active":
        return {
          bgColor: "bg-skyblue-400",
          textColor: "text-white",
          text: "Active",
        };
      case "Expired":
        return {
          bgColor: "bg-orange-400",
          textColor: "text-white",
          text: "Expired",
        };
      case "Cancelled":
        return {
          bgColor: "bg-beige-300",
          textColor: "text-beige-800",
          text: "Cancelled",
        };
      default:
        return {
          bgColor: "bg-beige-200",
          textColor: "text-beige-800",
          text: "Pending",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`badge ${config.bgColor} ${config.textColor} border-none font-medium ${className}`}>
      {config.text}
    </div>
  );
}
