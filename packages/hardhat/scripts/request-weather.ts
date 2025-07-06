import { ethers } from "hardhat";

async function main() {
  console.log("🌤️  Requesting weather data via Chainlink Functions...");

  // Configuration
  const contractAddress = "0xc08BCB039cFeC310C6DEDfaa58B00acc53B3bbF0"; // Deployed contract address
  const subscriptionId = 5274; // Replace with your subscription ID
  const args = ["10001", "US", "metric"]; // New York, US, Celsius

  // Contract address is already set correctly



  console.log("📍 Requesting weather for:", args[0], args[1], "in", args[2]);
  console.log("📋 Subscription ID:", subscriptionId);

  // Get the deployed contract
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer");
  const weatherConsumer = await WeatherConsumer.attach(contractAddress) as any;
  
  console.log("📄 Contract address:", await weatherConsumer.getAddress());

  // Send the request
  console.log("🚀 Sending weather request...");
  const tx = await weatherConsumer.sendRequest(subscriptionId, args);
  
  console.log("📝 Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Request sent successfully!");
  console.log("📊 Gas used:", receipt.gasUsed.toString());

  // Get the request ID from the event
  const events = receipt.logs;
  console.log("📋 Events emitted:", events.length);

  console.log("\n🎯 Next steps:");
  console.log("1. Monitor your request at: https://functions.chain.link");
  console.log("2. Wait for the request to be fulfilled (usually 1-2 minutes)");
  console.log("3. Check the contract for updated weather data");
  console.log("4. Run the test script to see the results");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 