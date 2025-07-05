import { InsuranceRequest, Operator, WeatherType } from "~~/app/types";

export const mockData: InsuranceRequest[] = [
  // Past insurance requests (January 2024)
  {
    id: 1,
    title: "Downtown Rain Protection",
    description:
      "Comprehensive rain insurance coverage for downtown business district. Protects against heavy rainfall that could disrupt operations and cause property damage.",
    user: "0xA7491A27e9B3F0C000D18dCa75638413Ea10c9Bd",
    amount: 5000, // $5000 coverage
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 50, // 50mm total rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Downtown District, 123 Main St, New York, NY",
    start: new Date("2024-01-15T08:00:00"),
    end: new Date("2024-01-15T16:30:00"),
    status: 2, // active
    offers: [
      {
        expert: "0xabcdef1234567890abcdef1234567890abcdef12",
        premium: 250,
        timestamp: new Date("2024-01-10T10:00:00"),
      },
      {
        expert: "0xfedcba0987654321fedcba0987654321fedcba09",
        premium: 280,
        timestamp: new Date("2024-01-10T11:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 4500,
    payout: false,
    timestamp: new Date("2024-01-15T08:00:00"),
  },
  {
    id: 2,
    title: "Suburban Wind Shield",
    description:
      "Wind damage protection for suburban residential areas. Covers property damage from sustained high winds that could affect homes and landscaping.",
    user: "0xA7491A27e9B3F0C000D18dCa75638413Ea10c9Bd",
    amount: 3000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 24, // 24 hours
        subThreshold: 60, // 60 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Suburban District, 456 Oak Ave, Brooklyn, NY",
    start: new Date("2024-01-14T10:15:00"),
    end: new Date("2024-01-14T18:45:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0x1111111111111111111111111111111111111111",
        premium: 150,
        timestamp: new Date("2024-01-09T14:30:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 3000,
    payout: false,
    timestamp: new Date("2024-01-14T10:15:00"),
  },
  {
    id: 3,
    title: "Industrial Flood Coverage",
    description:
      "Critical flood insurance for industrial facilities. Protects against operational disruptions and equipment damage from flood events.",
    user: "0x3456789012345678901234567890123456789012",
    amount: 10000,
    conditions: [
      {
        weatherType: WeatherType.Flood,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any flood event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Industrial Zone, 789 Pine Ln, Queens, NY",
    start: new Date("2024-01-13T06:30:00"),
    end: new Date("2024-01-13T14:20:00"),
    status: 2, // active
    offers: [
      {
        expert: "0x2222222222222222222222222222222222222222",
        premium: 500,
        timestamp: new Date("2024-01-08T09:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 8500,
    payout: false,
    timestamp: new Date("2024-01-13T06:30:00"),
  },
  {
    id: 4,
    title: "Park Hail Protection",
    description:
      "Specialized hail damage coverage for public parks and recreational areas. Protects against damage to facilities and landscaping from severe hailstorms.",
    user: "0xA7491A27e9B3F0C000D18dCa75638413Ea10c9Bd",
    amount: 2000,
    conditions: [
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 3, // 3 hours of hail
        subThreshold: 15, // 15mm hail size
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Central Park, New York, NY",
    start: new Date("2024-01-12T09:00:00"),
    end: new Date("2024-01-12T17:15:00"),
    status: 4, // cancelled
    offers: [
      {
        expert: "0x3333333333333333333333333333333333333333",
        premium: 100,
        timestamp: new Date("2024-01-07T10:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2024-01-12T09:00:00"),
  },
  {
    id: 5,
    title: "Residential Storm Coverage",
    description:
      "Comprehensive storm protection for residential properties. Covers damage from combined wind and rain events that could affect homes and personal property.",
    user: "0x5678901234567890123456789012345678901234",
    amount: 4000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 12, // 12 hours
        subThreshold: 80, // 80 km/h wind speed
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 100, // 100mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Residential Block, 101 Cedar St, Manhattan, NY",
    start: new Date("2024-01-11T07:45:00"),
    end: new Date("2024-01-11T15:30:00"),
    status: 2, // active
    offers: [
      {
        expert: "0x4444444444444444444444444444444444444444",
        premium: 320,
        timestamp: new Date("2024-01-06T08:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 4000,
    payout: false,
    timestamp: new Date("2024-01-11T07:45:00"),
  },
  {
    id: 6,
    title: "Airport Terminal Weather Guard",
    description:
      "Critical weather insurance for airport operations. Protects against delays and cancellations due to severe weather conditions affecting air traffic.",
    user: "0xA7491A27e9B3F0C000D18dCa75638413Ea10c9Bd",
    amount: 25000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 6, // 6 hours
        subThreshold: 100, // 100 km/h wind speed
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 80, // 80mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "JFK International Airport, Queens, NY",
    start: new Date("2024-01-10T00:00:00"),
    end: new Date("2024-01-10T23:59:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0x5555555555555555555555555555555555555555",
        premium: 1250,
        timestamp: new Date("2024-01-05T12:00:00"),
      },
      {
        expert: "0x6666666666666666666666666666666666666666",
        premium: 1100,
        timestamp: new Date("2024-01-05T13:30:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 25000,
    payout: false,
    timestamp: new Date("2024-01-10T00:00:00"),
  },
  {
    id: 7,
    title: "Shopping Mall Rain Coverage",
    description:
      "Rain damage protection for outdoor shopping areas and parking facilities. Covers structural damage and customer safety concerns during heavy rainfall.",
    user: "0x7890123456789012345678901234567890123456",
    amount: 7500,
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 75, // 75mm total rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Westfield Shopping Center, Brooklyn, NY",
    start: new Date("2024-01-09T09:00:00"),
    end: new Date("2024-01-09T21:00:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0x7777777777777777777777777777777777777777",
        premium: 375,
        timestamp: new Date("2024-01-04T14:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 7500,
    payout: false,
    timestamp: new Date("2024-01-09T09:00:00"),
  },
  {
    id: 8,
    title: "Hospital Emergency Weather Shield",
    description:
      "Emergency weather protection for critical healthcare facilities. Ensures continued operations during severe weather events that could affect patient care.",
    user: "0x8901234567890123456789012345678901234567",
    amount: 15000,
    conditions: [
      {
        weatherType: WeatherType.Tornado,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any tornado event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 4, // 4 hours of hail
        subThreshold: 25, // 25mm hail size
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Mount Sinai Hospital, Manhattan, NY",
    start: new Date("2024-01-08T00:00:00"),
    end: new Date("2024-01-08T23:59:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0x8888888888888888888888888888888888888888",
        premium: 750,
        timestamp: new Date("2024-01-03T10:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 15000,
    payout: false,
    timestamp: new Date("2024-01-08T00:00:00"),
  },
  {
    id: 9,
    title: "Construction Site Wind Protection",
    description:
      "Wind damage insurance for active construction sites. Protects against equipment damage and work delays caused by high wind conditions.",
    user: "0x9012345678901234567890123456789012345678",
    amount: 12000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 18, // 18 hours
        subThreshold: 70, // 70 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Brooklyn Construction Site, Brooklyn, NY",
    start: new Date("2024-01-07T06:00:00"),
    end: new Date("2024-01-07T18:00:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0x9999999999999999999999999999999999999999",
        premium: 600,
        timestamp: new Date("2024-01-02T11:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 12000,
    payout: false,
    timestamp: new Date("2024-01-07T06:00:00"),
  },
  {
    id: 10,
    title: "University Campus Flood Guard",
    description:
      "Flood protection for university campus facilities and student housing. Covers damage to buildings, equipment, and educational materials during flood events.",
    user: "0xa012345678901234567890123456789012345678",
    amount: 18000,
    conditions: [
      {
        weatherType: WeatherType.Flood,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any flood event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 120, // 120mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Columbia University, Manhattan, NY",
    start: new Date("2024-01-06T00:00:00"),
    end: new Date("2024-01-06T23:59:00"),
    status: 3, // expired
    offers: [
      {
        expert: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        premium: 900,
        timestamp: new Date("2024-01-01T09:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 18000,
    payout: false,
    timestamp: new Date("2024-01-06T00:00:00"),
  },
  // Future insurance requests (upcoming months in 2025)
  {
    id: 11,
    title: "Future Downtown Rain Shield",
    description:
      "Advanced rain protection system for expanded downtown area. Provides comprehensive coverage for new business developments and infrastructure.",
    user: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
    amount: 6000,
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 75, // 75mm total rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Proposed Downtown Extension, New York, NY",
    start: new Date("2025-06-15T09:00:00"),
    end: new Date("2025-06-15T17:30:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9",
        premium: 300,
        timestamp: new Date("2025-05-20T10:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-06-15T09:00:00"),
  },
  {
    id: 12,
    title: "Suburban Tornado Watch",
    description:
      "Critical tornado insurance for suburban communities. Provides emergency coverage for severe tornado events that could cause catastrophic damage.",
    user: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
    amount: 15000,
    conditions: [
      {
        weatherType: WeatherType.Tornado,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any tornado event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Proposed New Suburban Hub, Brooklyn, NY",
    start: new Date("2025-06-20T11:30:00"),
    end: new Date("2025-06-20T19:45:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
        premium: 750,
        timestamp: new Date("2025-05-15T11:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 8000,
    payout: false,
    timestamp: new Date("2025-06-20T11:30:00"),
  },
  {
    id: 13,
    title: "Industrial Multi-Weather Shield",
    description:
      "Comprehensive multi-hazard weather insurance for large industrial complexes. Covers wind, hail, and flood damage to protect critical infrastructure and operations.",
    user: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3",
    amount: 20000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 48, // 48 hours
        subThreshold: 70, // 70 km/h wind speed
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 6, // 6 hours of hail
        subThreshold: 20, // 20mm hail size
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Flood,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any flood event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Proposed Industrial Complex Alpha, Queens, NY",
    start: new Date("2025-07-05T07:15:00"),
    end: new Date("2025-07-05T15:20:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1",
        premium: 1200,
        timestamp: new Date("2025-06-10T07:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-07-05T07:15:00"),
  },
  {
    id: 14,
    title: "Park Weather Monitoring",
    description:
      "Environmental weather monitoring insurance for urban parks. Protects against weather-related damage to park facilities and green spaces.",
    user: "0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
    amount: 3500,
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 60, // 60mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Proposed Central Park Monitoring, New York, NY",
    start: new Date("2025-07-12T08:45:00"),
    end: new Date("2025-07-12T16:15:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0xd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
        premium: 175,
        timestamp: new Date("2025-06-05T09:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 2000,
    payout: false,
    timestamp: new Date("2025-07-12T08:45:00"),
  },
  {
    id: 15,
    title: "High-Rise Wind Protection",
    description:
      "Specialized wind damage insurance for high-rise residential buildings. Protects against structural damage and window breakage from extreme wind events.",
    user: "0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
    amount: 8000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 36, // 36 hours
        subThreshold: 90, // 90 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Proposed Residential Tower Block, Manhattan, NY",
    start: new Date("2025-07-18T10:00:00"),
    end: new Date("2025-07-18T18:30:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0xe4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3",
        premium: 400,
        timestamp: new Date("2025-06-15T10:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-07-18T10:00:00"),
  },
  {
    id: 16,
    title: "Beach Resort Hurricane Shield",
    description:
      "Hurricane and storm surge protection for beachfront resort properties. Comprehensive coverage against wind, rain, and flood damage during hurricane season.",
    user: "0x1617181920212223242526272829303132333435",
    amount: 35000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 72, // 72 hours
        subThreshold: 120, // 120 km/h wind speed (hurricane force)
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 200, // 200mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Flood,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any flood event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Rockaway Beach Resort, Queens, NY",
    start: new Date("2025-08-01T00:00:00"),
    end: new Date("2025-08-03T23:59:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        premium: 1750,
        timestamp: new Date("2025-07-01T12:00:00"),
      },
      {
        expert: "0xcccccccccccccccccccccccccccccccccccccccc",
        premium: 1950,
        timestamp: new Date("2025-07-02T10:30:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 28000,
    payout: false,
    timestamp: new Date("2025-08-01T00:00:00"),
  },
  {
    id: 17,
    title: "Agricultural Crop Hail Insurance",
    description:
      "Specialized hail damage protection for agricultural fields and crops. Covers crop loss and damage from severe hailstorms during growing season.",
    user: "0xA7491A27e9B3F0C000D18dCa75638413Ea10c9Bd",
    amount: 8500,
    conditions: [
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 2, // 2 hours of hail
        subThreshold: 10, // 10mm hail size
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Long Island Agricultural District, NY",
    start: new Date("2025-08-10T06:00:00"),
    end: new Date("2025-08-10T20:00:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0xdddddddddddddddddddddddddddddddddddddddd",
        premium: 425,
        timestamp: new Date("2025-07-15T14:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-08-10T06:00:00"),
  },
  {
    id: 18,
    title: "Stadium Event Weather Guard",
    description:
      "Weather protection for outdoor stadium events and concerts. Covers event cancellation and equipment damage due to severe weather conditions.",
    user: "0x1819202122232425262728293031323334353637",
    amount: 22000,
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 30, // 30mm rainfall during event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 4, // 4 hours
        subThreshold: 80, // 80 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Yankee Stadium, Bronx, NY",
    start: new Date("2025-08-15T18:00:00"),
    end: new Date("2025-08-15T23:00:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        premium: 1100,
        timestamp: new Date("2025-07-20T09:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 15000,
    payout: false,
    timestamp: new Date("2025-08-15T18:00:00"),
  },
  {
    id: 19,
    title: "Shipping Port Storm Coverage",
    description:
      "Marine weather insurance for shipping port operations. Protects against cargo damage and operational delays from severe storms and high winds.",
    user: "0x1920212223242526272829303132333435363738",
    amount: 45000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 24, // 24 hours
        subThreshold: 85, // 85 km/h wind speed
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 150, // 150mm rainfall
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Port of New York, Brooklyn, NY",
    start: new Date("2025-09-01T00:00:00"),
    end: new Date("2025-09-02T23:59:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0xffffffffffffffffffffffffffffffffffffffffff",
        premium: 2250,
        timestamp: new Date("2025-08-01T11:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-09-01T00:00:00"),
  },
  {
    id: 20,
    title: "School District Tornado Preparedness",
    description:
      "Tornado protection insurance for school district facilities. Ensures student safety and protects educational infrastructure during tornado threats.",
    user: "0x2021222324252627282930313233343536373839",
    amount: 28000,
    conditions: [
      {
        weatherType: WeatherType.Tornado,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any tornado event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Nassau County School District, NY",
    start: new Date("2025-09-05T07:00:00"),
    end: new Date("2025-09-05T16:00:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0x1010101010101010101010101010101010101010",
        premium: 1400,
        timestamp: new Date("2025-08-05T10:00:00"),
      },
      {
        expert: "0x2020202020202020202020202020202020202020",
        premium: 1200,
        timestamp: new Date("2025-08-06T14:30:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 20000,
    payout: false,
    timestamp: new Date("2025-09-05T07:00:00"),
  },
  {
    id: 21,
    title: "Data Center Flood Protection",
    description:
      "Critical flood insurance for data center facilities. Protects against server damage and data loss from flooding that could affect cloud services.",
    user: "0x2122232425262728293031323334353637383940",
    amount: 50000,
    conditions: [
      {
        weatherType: WeatherType.Flood,
        op: Operator.GreaterThan,
        aggregateValue: 1, // Any flood event
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 100, // 100mm rainfall in 24h
        subThreshold: 0,
        subOp: Operator.Equal,
      },
    ],
    location: "Manhattan Data Center, New York, NY",
    start: new Date("2025-09-10T00:00:00"),
    end: new Date("2025-09-11T23:59:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0x3030303030303030303030303030303030303030",
        premium: 2500,
        timestamp: new Date("2025-08-10T16:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-09-10T00:00:00"),
  },
  {
    id: 22,
    title: "Outdoor Market Hail Shield",
    description:
      "Hail damage protection for outdoor farmers markets and vendor stalls. Covers merchandise damage and vendor compensation during hailstorms.",
    user: "0x2223242526272829303132333435363738394041",
    amount: 4500,
    conditions: [
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 1, // 1 hour of hail
        subThreshold: 8, // 8mm hail size
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Union Square Farmers Market, Manhattan, NY",
    start: new Date("2025-09-15T08:00:00"),
    end: new Date("2025-09-15T16:00:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0x4040404040404040404040404040404040404040",
        premium: 225,
        timestamp: new Date("2025-08-15T12:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 3000,
    payout: false,
    timestamp: new Date("2025-09-15T08:00:00"),
  },
  {
    id: 23,
    title: "Bridge Infrastructure Wind Guard",
    description:
      "Wind damage insurance for critical bridge infrastructure. Protects against structural damage and ensures safe passage during high wind events.",
    user: "0x2324252627282930313233343536373839404142",
    amount: 75000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 12, // 12 hours
        subThreshold: 110, // 110 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Brooklyn Bridge, New York, NY",
    start: new Date("2025-09-20T00:00:00"),
    end: new Date("2025-09-21T23:59:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0x5050505050505050505050505050505050505050",
        premium: 3750,
        timestamp: new Date("2025-08-20T09:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-09-20T00:00:00"),
  },
  {
    id: 24,
    title: "Festival Weather Emergency Plan",
    description:
      "Multi-day festival weather insurance covering rain, wind, and storm cancellations. Protects organizers and attendees from weather-related financial losses.",
    user: "0x2425262728293031323334353637383940414243",
    amount: 18500,
    conditions: [
      {
        weatherType: WeatherType.Rain,
        op: Operator.GreaterThan,
        aggregateValue: 40, // 40mm rainfall per day
        subThreshold: 0,
        subOp: Operator.Equal,
      },
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 8, // 8 hours
        subThreshold: 65, // 65 km/h wind speed
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Central Park SummerStage, Manhattan, NY",
    start: new Date("2025-09-25T12:00:00"),
    end: new Date("2025-09-27T22:00:00"),
    status: 1, // funding
    offers: [
      {
        expert: "0x6060606060606060606060606060606060606060",
        premium: 925,
        timestamp: new Date("2025-08-25T15:00:00"),
      },
      {
        expert: "0x7070707070707070707070707070707070707070",
        premium: 850,
        timestamp: new Date("2025-08-26T11:30:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 12000,
    payout: false,
    timestamp: new Date("2025-09-25T12:00:00"),
  },
  {
    id: 25,
    title: "Telecommunications Tower Storm Shield",
    description:
      "Storm protection for telecommunications infrastructure. Ensures network continuity and protects against equipment damage during severe weather.",
    user: "0x2526272829303132333435363738394041424344",
    amount: 32000,
    conditions: [
      {
        weatherType: WeatherType.Wind,
        op: Operator.GreaterThan,
        aggregateValue: 18, // 18 hours
        subThreshold: 95, // 95 km/h wind speed
        subOp: Operator.GreaterThan,
      },
      {
        weatherType: WeatherType.Hail,
        op: Operator.GreaterThan,
        aggregateValue: 3, // 3 hours of hail
        subThreshold: 20, // 20mm hail size
        subOp: Operator.GreaterThan,
      },
    ],
    location: "Queens Telecommunications Hub, Queens, NY",
    start: new Date("2025-10-01T00:00:00"),
    end: new Date("2025-10-02T23:59:00"),
    status: 0, // pending
    offers: [
      {
        expert: "0x8080808080808080808080808080808080808080",
        premium: 1600,
        timestamp: new Date("2025-09-01T13:00:00"),
      },
    ],
    selectedOffer: 0,
    investments: [],
    totalFunded: 0,
    payout: false,
    timestamp: new Date("2025-10-01T00:00:00"),
  },
];
