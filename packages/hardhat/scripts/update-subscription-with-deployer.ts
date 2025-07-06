import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Updating subscription ID with deployer account...");

  // Configuration
  const contractAddress = "0xc08BCB039cFeC310C6DEDfaa58B00acc53B3bbF0";
  const newSubscriptionId = 5274; // Your actual subscription ID

  // Use the deployer private key (same as in hardhat.config.ts)
  const deployerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const deployer = new ethers.Wallet(deployerPrivateKey, ethers.provider);
  
  console.log("👤 Deployer address:", deployer.address);
  console.log("📄 Contract address:", contractAddress);
  console.log("🆔 New subscription ID:", newSubscriptionId);

  // Get the deployed contract with deployer signer
  const WeatherConsumer = await ethers.getContractFactory("WeatherConsumer", deployer);
  const weatherConsumer = await WeatherConsumer.attach(contractAddress) as any;
  
  console.log("👤 Contract owner:", await weatherConsumer.owner());
  console.log("📋 Current subscription ID:", await weatherConsumer.s_subscriptionId());

  // Check if deployer is the owner
  const contractOwner = await weatherConsumer.owner();
  if (contractOwner !== deployer.address) {
    console.error("❌ Error: Deployer is not the contract owner!");
    console.error("Expected owner:", deployer.address);
    console.error("Actual owner:", contractOwner);
    process.exit(1);
  }

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