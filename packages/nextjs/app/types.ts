export const SENSOR_STATUS_OPTIONS = ["Pending", "Funding", "Active", "Expired", "Cancelled"] as const;

export type SensorStatus = (typeof SENSOR_STATUS_OPTIONS)[number];

export const DEFAULT_SENSOR_STATUS: SensorStatus = "Pending";
