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
      case "Premium Payment":
        return {
          bgColor: "bg-orange-200",
          textColor: "text-orange-800",
          text: "Premium Payment",
        };
      case "Active":
        return {
          bgColor: "bg-skyblue-400",
          textColor: "text-white",
          text: "Active",
        };
      case "Expired":
        return {
          bgColor: "bg-orange-300",
          textColor: "text-white",
          text: "Expired",
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
