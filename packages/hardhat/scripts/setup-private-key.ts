import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🔧 Setting up private key for deployment...");
  
  // Check if .env file exists
  const envPath = "./.env";
  let envContent = "";
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }
  
  console.log("\n📝 To use your own account, you need to:");
  console.log("1. Create a .env file in packages/hardhat/ directory");
  console.log("2. Add your private key like this:");
  console.log("   __RUNTIME_DEPLOYER_PRIVATE_KEY=your_private_key_here");
  console.log("\n⚠️  IMPORTANT:");
  console.log("- Don't include the 0x prefix");
  console.log("- Make sure your account has Sepolia ETH");
  console.log("- Never share your private key");
  
  console.log("\n💡 Alternative: Use the account import script");
  console.log("Run: yarn hardhat run scripts/importAccount.ts");
  
  console.log("\n🎯 After setting up your private key:");
  console.log("1. Check balance: yarn hardhat run scripts/check-balance.ts --network sepolia");
  console.log("2. Deploy contract: yarn hardhat run scripts/deploy-fresh-weather.ts --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 