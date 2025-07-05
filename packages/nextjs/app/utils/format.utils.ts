export interface FormattedTime {
  startDate: string;
  lastingPeriod: string;
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

  // Calculate duration
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format duration
  let lastingPeriod = "";
  if (durationHours > 0) {
    lastingPeriod += `${durationHours}h`;
    if (durationMinutes > 0) {
      lastingPeriod += ` ${durationMinutes}m`;
    }
  } else {
    lastingPeriod = `${durationMinutes}m`;
  }

  return {
    startDate: startDateFormatted,
    lastingPeriod: lastingPeriod,
  };
}
