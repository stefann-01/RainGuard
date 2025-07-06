import { Operator, WeatherType } from "~~/app/types";

// Format USDC amount (6 decimals) to display format
export function formatUSDCAmount(amount: number): string {
  // Convert from 6 decimal places to actual USDC amount
  const usdcAmount = amount / 1000000;
  return `${usdcAmount.toLocaleString()} USDC`;
}

// Format USDC amount with decimals for precise display
export function formatUSDCAmountWithDecimals(amount: number): string {
  const usdcAmount = amount / 1000000;
  return `${usdcAmount.toFixed(2)} USDC`;
}

export interface FormattedTime {
  startDate: string;
  lastingPeriod: string;
  endDate: string;
}

export function formatTimeRange(startDate: Date, endDate: Date): FormattedTime {
  // Format start date
  const startDateFormatted = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endDateFormatted = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate duration
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationSeconds = Math.floor(durationMs / 1000);
  const durationMinutes = Math.floor(durationSeconds / 60);
  const durationHours = Math.floor(durationMinutes / 60);
  const durationDays = Math.floor(durationHours / 24);
  const durationMonths = Math.floor(durationDays / 30);

  // Format duration
  let lastingPeriod = "";

  if (durationMonths > 0) {
    lastingPeriod += `${durationMonths}mo`;
    const remainingDays = durationDays % 30;
    if (remainingDays > 0) {
      lastingPeriod += ` ${remainingDays}d`;
    }
    const remainingHours = durationHours % 24;
    if (remainingHours > 0) {
      lastingPeriod += ` ${remainingHours}h`;
    }
  } else if (durationDays > 0) {
    lastingPeriod += `${durationDays}d`;
    const remainingHours = durationHours % 24;
    if (remainingHours > 0) {
      lastingPeriod += ` ${remainingHours}h`;
    }
  } else if (durationHours > 0) {
    lastingPeriod += `${durationHours}h`;
    const remainingMinutes = durationMinutes % 60;
    if (remainingMinutes > 0) {
      lastingPeriod += ` ${remainingMinutes}m`;
    }
  } else {
    lastingPeriod = `${durationMinutes}m`;
  }

  return {
    startDate: startDateFormatted,
    lastingPeriod: lastingPeriod,
    endDate: endDateFormatted,
  };
}

// Weather utility functions
export function getWeatherTypeName(weatherType: WeatherType): string {
  switch (weatherType) {
    case WeatherType.Rain:
      return "Rain";
    case WeatherType.Wind:
      return "Wind";
    case WeatherType.Tornado:
      return "Tornado";
    case WeatherType.Flood:
      return "Flood";
    case WeatherType.Hail:
      return "Hail";
    default:
      return "Unknown";
  }
}

export function getOperatorName(operator: Operator): string {
  switch (operator) {
    case Operator.LessThan:
      return "<";
    case Operator.GreaterThan:
      return ">";
    case Operator.Equal:
      return "=";
    default:
      return "?";
  }
}

export function getWeatherTypeIcon(weatherType: WeatherType): string {
  switch (weatherType) {
    case WeatherType.Rain:
      return "🌧️";
    case WeatherType.Wind:
      return "💨";
    case WeatherType.Tornado:
      return "🌪️";
    case WeatherType.Flood:
      return "🌊";
    case WeatherType.Hail:
      return "🧊";
    default:
      return "❓";
  }
}

// Format timestamp to consistent string
export function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
