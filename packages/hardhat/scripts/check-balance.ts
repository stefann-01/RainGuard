import { ethers } from "hardhat";

async function main() {
  console.log("💰 Checking account balance...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Account address:", deployer.address);

  // Check ETH balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("💎 ETH Balance:", balanceInEth, "ETH");
  
  if (balance === 0n) {
    console.log("\n❌ No ETH found! You need to fund your account.");
    console.log("\n🎯 Get Sepolia ETH from these faucets:");
    console.log("1. Alchemy Faucet: https://sepoliafaucet.com/");
    console.log("2. Chainlink Faucet: https://faucets.chain.link/sepolia");
    console.log("3. Infura Faucet: https://www.infura.io/faucet/sepolia");
    console.log("\n📝 Steps:");
    console.log("1. Go to one of the faucets above");
    console.log("2. Enter your address:", deployer.address);
    console.log("3. Request test ETH (0.1-1 ETH should be enough)");
    console.log("4. Wait for the transaction to confirm");
    console.log("5. Run this script again to verify");
  } else if (balance < ethers.parseEther("0.01")) {
    console.log("\n⚠️  Low balance! You might need more ETH for deployment.");
    console.log("💡 Consider getting more test ETH from the faucets above.");
  } else {
    console.log("\n✅ Sufficient balance for deployment!");
    console.log("🚀 You can now run: yarn hardhat run scripts/deploy-fresh-weather.ts --network sepolia");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 