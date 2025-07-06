import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// WeatherType { Rain = 0, Wind = 1, Tornado = 2, Flood = 3, Hail = 4 }
// Operator { LessThan = 0, GreaterThan = 1, Equal = 2 }

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { execute } = hre.deployments;

  console.log("\n 📝 Creating 15 realistic insurance requests...");

  // Realistic insurance requests with specific details
  const requests = [
    {
      title: "Downtown Miami Hurricane Protection",
      description:
        "Protection for commercial properties in downtown Miami against hurricane-force winds and heavy rainfall during storm season.",
      amount: 50000, // 50,000 USDC
      conditions: [
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 120, // 120 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Downtown Miami, FL",
    },
    {
      title: "Central Park Event Rain Coverage",
      description:
        "Insurance for outdoor events in Central Park against heavy rainfall that could disrupt activities and cause financial losses.",
      amount: 15000, // 15,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 25, // 25mm rain
          subThreshold: 5,
          subOp: 1, // GreaterThan
        },
      ],
      location: "Central Park, New York, NY",
    },
    {
      title: "Venice Beach Flood Protection",
      description:
        "Protection for beachfront properties in Venice Beach against coastal flooding and storm surge during extreme weather events.",
      amount: 75000, // 75,000 USDC
      conditions: [
        {
          weatherType: 3, // Flood
          op: 1, // GreaterThan
          aggregateValue: 1, // Any flood event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Venice Beach, Los Angeles, CA",
    },
    {
      title: "Chicago Windy City Festival",
      description:
        "Insurance for the annual Windy City Festival against extreme wind conditions that could damage temporary structures and equipment.",
      amount: 25000, // 25,000 USDC
      conditions: [
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 80, // 80 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Grant Park, Chicago, IL",
    },
    {
      title: "Houston Golf Course Hail Protection",
      description:
        "Protection for the Memorial Park Golf Course against hail damage to greens, equipment, and facilities during spring storms.",
      amount: 35000, // 35,000 USDC
      conditions: [
        {
          weatherType: 4, // Hail
          op: 1, // GreaterThan
          aggregateValue: 1, // Any hail event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Memorial Park Golf Course, Houston, TX",
    },
    {
      title: "Times Square New Year's Rain Coverage",
      description:
        "Insurance for New Year's Eve celebrations in Times Square against heavy rainfall that could reduce attendance and revenue.",
      amount: 100000, // 100,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 15, // 15mm rain
          subThreshold: 3,
          subOp: 1, // GreaterThan
        },
      ],
      location: "Times Square, New York, NY",
    },
    {
      title: "Miami Beach Tornado Warning",
      description:
        "Protection for Miami Beach hotels and resorts against tornado damage during hurricane season and severe weather outbreaks.",
      amount: 200000, // 200,000 USDC
      conditions: [
        {
          weatherType: 2, // Tornado
          op: 1, // GreaterThan
          aggregateValue: 1, // Any tornado event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Miami Beach, FL",
    },
    {
      title: "LA Marathon Weather Protection",
      description:
        "Insurance for the Los Angeles Marathon against extreme weather conditions that could force cancellation or cause participant issues.",
      amount: 50000, // 50,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 20, // 20mm rain
          subThreshold: 0,
          subOp: 2, // Equal
        },
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 60, // 60 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Los Angeles Marathon Route, CA",
    },
    {
      title: "Chicago Riverwalk Flood Coverage",
      description:
        "Protection for businesses along the Chicago Riverwalk against flooding from heavy rainfall and river overflow.",
      amount: 40000, // 40,000 USDC
      conditions: [
        {
          weatherType: 3, // Flood
          op: 1, // GreaterThan
          aggregateValue: 1, // Any flood event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Chicago Riverwalk, Chicago, IL",
    },
    {
      title: "Houston Rodeo Storm Protection",
      description:
        "Insurance for the Houston Livestock Show and Rodeo against severe weather that could damage outdoor venues and reduce attendance.",
      amount: 75000, // 75,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 30, // 30mm rain
          subThreshold: 0,
          subOp: 2, // Equal
        },
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 70, // 70 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "NRG Stadium, Houston, TX",
    },
    {
      title: "Brooklyn Bridge Park Wind Coverage",
      description:
        "Protection for outdoor events and facilities at Brooklyn Bridge Park against high winds that could damage temporary structures.",
      amount: 30000, // 30,000 USDC
      conditions: [
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 90, // 90 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Brooklyn Bridge Park, Brooklyn, NY",
    },
    {
      title: "Miami Art Basel Weather Insurance",
      description:
        "Insurance for Art Basel Miami Beach against weather conditions that could affect outdoor installations and reduce visitor numbers.",
      amount: 150000, // 150,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 20, // 20mm rain
          subThreshold: 0,
          subOp: 2, // Equal
        },
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 50, // 50 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Miami Beach Convention Center, FL",
    },
    {
      title: "LA Dodger Stadium Hail Protection",
      description:
        "Protection for Dodger Stadium and surrounding parking areas against hail damage during baseball season storms.",
      amount: 60000, // 60,000 USDC
      conditions: [
        {
          weatherType: 4, // Hail
          op: 1, // GreaterThan
          aggregateValue: 1, // Any hail event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Dodger Stadium, Los Angeles, CA",
    },
    {
      title: "Chicago Navy Pier Storm Coverage",
      description:
        "Insurance for Navy Pier attractions and events against severe storms that could cause closures and revenue loss.",
      amount: 45000, // 45,000 USDC
      conditions: [
        {
          weatherType: 0, // Rain
          op: 1, // GreaterThan
          aggregateValue: 35, // 35mm rain
          subThreshold: 0,
          subOp: 2, // Equal
        },
        {
          weatherType: 1, // Wind
          op: 1, // GreaterThan
          aggregateValue: 75, // 75 km/h wind
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Navy Pier, Chicago, IL",
    },
    {
      title: "Houston Medical Center Flood Protection",
      description:
        "Critical protection for the Texas Medical Center against flooding that could disrupt healthcare services and damage medical equipment.",
      amount: 300000, // 300,000 USDC
      conditions: [
        {
          weatherType: 3, // Flood
          op: 1, // GreaterThan
          aggregateValue: 1, // Any flood event
          subThreshold: 0,
          subOp: 2, // Equal
        },
      ],
      location: "Texas Medical Center, Houston, TX",
    },
  ];

  // Current timestamp
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 24 * 60 * 60;
  const oneMonth = 30 * oneDay;

  // Create 15 realistic requests
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const start = BigInt(now + oneDay); // Starts tomorrow
    const end = BigInt(now + oneMonth); // Ends in a month

    try {
      await execute(
        "InsuranceManager",
        { from: deployer, log: true },
        "createRequest",
        request.title,
        request.description,
        BigInt(request.amount * 1e6), // Convert to USDC decimals
        request.conditions,
        request.location,
        start,
        end,
      );

      console.log(`✅ Created request #${i + 1}: ${request.title}`);
    } catch (error) {
      console.error(`❌ Failed to create request #${i + 1}:`, error);
    }
  }
};

func.tags = ["sample-requests"];
func.dependencies = ["InsuranceManager"];

export default func;
