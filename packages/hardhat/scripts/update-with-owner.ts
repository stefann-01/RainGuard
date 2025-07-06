import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Updating subscription ID with contract owner...");

  // Configuration
  const contractAddress = "0xc08BCB039cFeC310C6DEDfaa58B00acc53B3bbF0";
  const newSubscriptionId = 5274; // Your actual subscription ID

  // The account that owns the contract (from your previous deployment)
  const contractOwnerAddress = "0xbdDCbe845E67234507F437B251f415Ac256b1C78";
  
  console.log("📄 Contract address:", contractAddress);
  console.log("👤 Contract owner:", contractOwnerAddress);
  console.log("🆔 New subscription ID:", newSubscriptionId);

  // Get the contract
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer");
  const weatherConsumer = await WeatherConsumer.attach(contractAddress) as any;
  
  console.log("📋 Current subscription ID:", await weatherConsumer.s_subscriptionId());

  console.log("\n⚠️  IMPORTANT: You need to use the account that owns this contract.");
  console.log("👤 Contract owner address:", contractOwnerAddress);
  console.log("\n📝 To update the subscription ID, you need to:");
  console.log("1. Use a wallet with address:", contractOwnerAddress);
  console.log("2. Call the updateConfig function with your subscription ID");
  console.log("3. Or deploy a new contract with your current account");
  
  console.log("\n💡 Alternative: Deploy a new contract with your current account");
  console.log("This way you won't need to change the consumer in Chainlink Functions.");
  console.log("Run: yarn hardhat run scripts/deploy-fresh-weather.ts --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 