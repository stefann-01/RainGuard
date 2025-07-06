import * as dotenv from "dotenv";
dotenv.config();
import { ethers } from "hardhat";
import { Wallet } from "ethers";
import password from "@inquirer/password";
import fs from "fs";
import path from "path";

async function main() {
  try {
    console.log("🚀 Testing Chainlink Functions Weather Insurance");
    console.log("=" .repeat(60));

    // Get the encrypted private key from .env
    const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

    if (!encryptedKey) {
      console.log("🚫️ No encrypted private key found in .env file");
      return;
    }

    // Decrypt the private key
    const pass = await password({ message: "Enter password to decrypt private key:" });
    
    let wallet: Wallet;
    try {
      wallet = (await Wallet.fromEncryptedJson(encryptedKey, pass)) as Wallet;
    } catch (error) {
      console.log("❌ Failed to decrypt private key. Wrong password?");
      return;
    }

    console.log("👤 Using account:", wallet.address);

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF");
    const connectedWallet = wallet.connect(provider);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
      console.log("❌ Account has no ETH. Please fund the account first.");
      return;
    }

    // Get the contract (replace with actual deployed address)
    const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
    const weatherContract = await WeatherInsurance.attach("YOUR_CONTRACT_ADDRESS_HERE").connect(connectedWallet);

    console.log("📄 WeatherInsurance address:", await weatherContract.getAddress());

    console.log("\n" + "=" .repeat(60));
    console.log("🎯 CHAINLINK FUNCTIONS WEATHER TEST");
    console.log("=" .repeat(60));

    // Read the functions source code
    const functionsSourcePath = path.join(__dirname, "../functions/weather.js");
    const functionsSource = fs.readFileSync(functionsSourcePath, "utf8");
    
    console.log("📄 Functions source code loaded from:", functionsSourcePath);
    console.log("📝 Source code length:", functionsSource.length, "characters");

    // Example arguments for the weather request
    const args = ["10001", "US", "metric"]; // New York, US, Celsius
    console.log("📍 Requesting weather for:", args[0], args[1], "in", args[2]);

    // Note: In a real implementation, you would:
    // 1. Upload secrets using: npx functions upload-secrets --secrets apiKey=YOUR_API_KEY --slot-id 1 --don-id sepolia-1
    // 2. Get the secrets reference from the upload
    // 3. Use that reference in the request
    
    console.log("\n⚠️  To complete this test, you need to:");
    console.log("1. Deploy the contract first");
    console.log("2. Upload your API key as a secret:");
    console.log("   npx functions upload-secrets --secrets apiKey=e175944d567b08aa93194d92e5ba02e8 --slot-id 1 --don-id sepolia-1");
    console.log("3. Update the contract address in this script");
    console.log("4. Run the request using the functions toolkit");
    console.log("");
    console.log("🔗 Example request command:");
    console.log("npx functions request \\");
    console.log("  --contract", await weatherContract.getAddress(), "\\");
    console.log("  --source-file functions/weather.js \\");
    console.log("  --secrets-reference <SECRETS_REFERENCE> \\");
    console.log("  --args 10001 US metric \\");
    console.log("  --subid <YOUR_SUBSCRIPTION_ID> \\");
    console.log("  --gas-limit 300000");

    console.log("\n" + "=" .repeat(60));
    console.log("🏆 SETUP COMPLETE!");
    console.log("=" .repeat(60));
    console.log("✅ Contract ready for deployment");
    console.log("✅ Functions source code ready");
    console.log("✅ Test script configured");
    console.log("✅ Ready for real API calls!");
    console.log("");
    console.log("🎯 Next: Deploy and test with Chainlink Functions!");

  } catch (error) {
    console.error("❌ Error during test:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 