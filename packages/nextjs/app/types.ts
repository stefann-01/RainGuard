export const SENSOR_STATUS_OPTIONS = ["Pending", "Funding", "Active", "Expired", "Cancelled"] as const;

export type SensorStatus = (typeof SENSOR_STATUS_OPTIONS)[number];

export const DEFAULT_SENSOR_STATUS: SensorStatus = "Pending";

// Enums for weather types and operators
export enum WeatherType {
  Rain = 0,
  Wind = 1,
  Tornado = 2,
  Flood = 3,
  Hail = 4,
}

export enum Operator {
  LessThan = 0,
  GreaterThan = 1,
  Equal = 2,
}

// Unified struct for all weather conditions (aggregate or simple)
export interface WeatherCondition {
  weatherType: WeatherType; // e.g., Wind
  op: Operator; // e.g., GreaterThan (for the count or threshold)
  aggregateValue: number; // e.g., 100 (hours) or threshold value for simple cases
  subThreshold: number; // e.g., 50 (km/h), ignored for simple cases
  subOp: Operator; // e.g., GreaterThan (for wind speed), ignored for simple cases
}

// New Investment struct to match Solidity
export interface Investment {
  investor: string;
  amount: number;
}

// Structs
export interface InsuranceRequest {
  id: number;
  title: string;
  description?: string; // Optional description field
  user: string;
  amount: number;
  conditions: WeatherCondition[];
  location: string;
  start: Date; // Changed from number to Date
  end: Date; // Changed from number to Date
  status: number; // 0: pending, 1: funding, 2: active, 3: expired, 4: cancelled
  offers: Offer[];
  selectedOffer: number; // offer index
  investments: Investment[];
  totalFunded: number;
  payout: boolean;
  timestamp: Date; // When the request was created
}

export interface Offer {
  expert: string;
  premium: number;
  timestamp: Date; // Changed back to Date for frontend convenience
}

// Legacy types for backward compatibility (will be removed)
export interface Expert {
  address: string;
  rating: number; // 1-5 rating
  previousAcceptedRequestIds: number[];
}

export interface LegacyOffer {
  expert: Expert;
  amount: number; // Amount in ETH or USD
}

export interface SensorRequest {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  requestDate: Date;
  requestAddress: string; // Address of the person making the request
  status: SensorStatus;
  offers: LegacyOffer[];
}
