export interface MockDataItem {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export const mockData: MockDataItem[] = [
  // Past sensors (January 2024)
  {
    id: 1,
    title: "RainGuard Sensor #1",
    description: "Downtown Area - Main monitoring station for urban rainfall patterns",
    startDate: new Date("2024-01-15T08:00:00"),
    endDate: new Date("2024-01-15T16:30:00"),
  },
  {
    id: 2,
    title: "RainGuard Sensor #2",
    description: "Suburban District - Residential area rainfall monitoring",
    startDate: new Date("2024-01-14T10:15:00"),
    endDate: new Date("2024-01-14T18:45:00"),
  },
  {
    id: 3,
    title: "RainGuard Sensor #3",
    description: "Industrial Zone - Heavy rainfall monitoring for safety protocols",
    startDate: new Date("2024-01-13T06:30:00"),
    endDate: new Date("2024-01-13T14:20:00"),
  },
  {
    id: 4,
    title: "RainGuard Sensor #4",
    description: "Park Area - Environmental monitoring for green spaces",
    startDate: new Date("2024-01-12T09:00:00"),
    endDate: new Date("2024-01-12T17:15:00"),
  },
  {
    id: 5,
    title: "RainGuard Sensor #5",
    description: "Residential Block - Community rainfall data collection",
    startDate: new Date("2024-01-11T07:45:00"),
    endDate: new Date("2024-01-11T15:30:00"),
  },
  {
    id: 6,
    title: "RainGuard Sensor #6",
    description: "Shopping District - Commercial area weather monitoring",
    startDate: new Date("2024-01-10T11:20:00"),
    endDate: new Date("2024-01-10T19:00:00"),
  },
  {
    id: 7,
    title: "RainGuard Sensor #7",
    description: "Highway Exit - Traffic safety rainfall monitoring",
    startDate: new Date("2024-01-09T05:30:00"),
    endDate: new Date("2024-01-09T13:45:00"),
  },
  {
    id: 8,
    title: "RainGuard Sensor #8",
    description: "University Campus - Academic research rainfall data",
    startDate: new Date("2024-01-08T08:15:00"),
    endDate: new Date("2024-01-08T16:00:00"),
  },
  {
    id: 9,
    title: "RainGuard Sensor #9",
    description: "Hospital Area - Medical facility weather monitoring",
    startDate: new Date("2024-01-07T12:00:00"),
    endDate: new Date("2024-01-07T20:30:00"),
  },
  {
    id: 10,
    title: "RainGuard Sensor #10",
    description: "Airport Vicinity - Aviation weather monitoring",
    startDate: new Date("2024-01-06T04:45:00"),
    endDate: new Date("2024-01-06T12:15:00"),
  },
  // Future sensors (upcoming months in 2025)
  {
    id: 11,
    title: "RainGuard Sensor #11",
    description: "Future Downtown Extension - Enhanced urban monitoring system",
    startDate: new Date("2025-06-15T09:00:00"),
    endDate: new Date("2025-06-15T17:30:00"),
  },
  {
    id: 12,
    title: "RainGuard Sensor #12",
    description: "New Suburban Hub - Advanced residential monitoring",
    startDate: new Date("2025-06-20T11:30:00"),
    endDate: new Date("2025-06-20T19:45:00"),
  },
  {
    id: 13,
    title: "RainGuard Sensor #13",
    description: "Industrial Complex Alpha - Safety monitoring upgrade",
    startDate: new Date("2025-07-05T07:15:00"),
    endDate: new Date("2025-07-05T15:20:00"),
  },
  {
    id: 14,
    title: "RainGuard Sensor #14",
    description: "Central Park Monitoring - Environmental research station",
    startDate: new Date("2025-07-12T08:45:00"),
    endDate: new Date("2025-07-12T16:15:00"),
  },
  {
    id: 15,
    title: "RainGuard Sensor #15",
    description: "Residential Tower Block - High-rise weather monitoring",
    startDate: new Date("2025-07-18T10:00:00"),
    endDate: new Date("2025-07-18T18:30:00"),
  },
  {
    id: 16,
    title: "RainGuard Sensor #16",
    description: "Mall District - Commercial weather monitoring system",
    startDate: new Date("2025-08-01T12:20:00"),
    endDate: new Date("2025-08-01T20:00:00"),
  },
  {
    id: 17,
    title: "RainGuard Sensor #17",
    description: "Highway Junction - Traffic safety monitoring upgrade",
    startDate: new Date("2025-08-08T06:30:00"),
    endDate: new Date("2025-08-08T14:45:00"),
  },
  {
    id: 18,
    title: "RainGuard Sensor #18",
    description: "University Research Lab - Academic weather station",
    startDate: new Date("2025-08-15T09:15:00"),
    endDate: new Date("2025-08-15T17:00:00"),
  },
  {
    id: 19,
    title: "RainGuard Sensor #19",
    description: "Medical Center - Healthcare facility weather monitoring",
    startDate: new Date("2025-08-22T13:00:00"),
    endDate: new Date("2025-08-22T21:30:00"),
  },
  {
    id: 20,
    title: "RainGuard Sensor #20",
    description: "Airport Terminal - Aviation weather monitoring system",
    startDate: new Date("2025-09-01T05:45:00"),
    endDate: new Date("2025-09-01T13:15:00"),
  },
  {
    id: 21,
    title: "RainGuard Sensor #21",
    description: "Sports Complex - Athletic facility weather monitoring",
    startDate: new Date("2025-09-08T14:30:00"),
    endDate: new Date("2025-09-08T22:00:00"),
  },
  {
    id: 22,
    title: "RainGuard Sensor #22",
    description: "Tech Campus - Innovation district weather monitoring",
    startDate: new Date("2025-09-15T08:00:00"),
    endDate: new Date("2025-09-15T16:30:00"),
  },
  {
    id: 23,
    title: "RainGuard Sensor #23",
    description: "Harbor Area - Maritime weather monitoring station",
    startDate: new Date("2025-09-22T11:45:00"),
    endDate: new Date("2025-09-22T19:15:00"),
  },
  {
    id: 24,
    title: "RainGuard Sensor #24",
    description: "Mountain View - Elevated weather monitoring system",
    startDate: new Date("2025-10-01T07:20:00"),
    endDate: new Date("2025-10-01T15:50:00"),
  },
  {
    id: 25,
    title: "RainGuard Sensor #25",
    description: "Riverside Park - Waterfront weather monitoring",
    startDate: new Date("2025-10-08T10:10:00"),
    endDate: new Date("2025-10-08T18:40:00"),
  },
];
