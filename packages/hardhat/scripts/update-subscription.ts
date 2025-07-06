import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Updating subscription ID in WeatherConsumer contract...");

  // Configuration
  const contractAddress = "0xc08BCB039cFeC310C6DEDfaa58B00acc53B3bbF0";
  const newSubscriptionId = 5274; // Your actual subscription ID

  console.log("📄 Contract address:", contractAddress);
  console.log("🆔 New subscription ID:", newSubscriptionId);

  // Get the deployed contract
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer");
  const weatherConsumer = await WeatherConsumer.attach(contractAddress) as any;
  
  console.log("👤 Current owner:", await weatherConsumer.owner());
  console.log("📋 Current subscription ID:", await weatherConsumer.s_subscriptionId());

  // Update the subscription ID
  console.log("🚀 Updating subscription ID...");
  const tx = await weatherConsumer.updateConfig(
    await weatherConsumer.s_donId(), // Keep current DON ID
    newSubscriptionId, // New subscription ID
    await weatherConsumer.s_callbackGasLimit(), // Keep current gas limit
    await weatherConsumer.s_requestConfirmations() // Keep current confirmations
  );
  
  console.log("📝 Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Subscription ID updated successfully!");
  console.log("📊 Gas used:", receipt.gasUsed.toString());

  // Verify the update
  const updatedSubscriptionId = await weatherConsumer.s_subscriptionId();
  console.log("✅ Verified new subscription ID:", updatedSubscriptionId.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 