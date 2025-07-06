import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { get } = hre.deployments;

  console.log("\n 🧪 Setting up test accounts with USDC allowance...");

  try {
    // Get the deployed contracts
    const mockUSDC = await get("MockUSDC");
    const insuranceManager = await get("InsuranceManager");

    // Get USDC contract instance
    const usdc = await hre.ethers.getContractAt("IERC20", mockUSDC.address);

    console.log(`USDC Address: ${mockUSDC.address}`);
    console.log(`InsuranceManager Address: ${insuranceManager.address}`);

    // Get all signers (test accounts)
    const signers = await hre.ethers.getSigners();

    console.log(`\n📋 Setting up allowance for ${signers.length} Hardhat accounts...`);

    // Set up allowance for all Hardhat accounts
    let setupCount = 0;
    let successCount = 0;

    for (let i = 0; i < signers.length; i++) {
      const address = await signers[i].getAddress();
      setupCount++;
      console.log(`\n📝 Setting up account ${i}: ${address}`);

      // Check current allowance
      const currentAllowance = await usdc.allowance(address, insuranceManager.address);

      // If allowance is already infinite, skip
      if (currentAllowance === hre.ethers.MaxUint256) {
        console.log(`  ✅ Infinite allowance already set for ${address}`);
        successCount++;
        continue;
      }

      // We can sign for this address since it's a Hardhat signer
      console.log(`  🔐 Approving infinite USDC allowance for ${address}...`);

      try {
        const tx = await usdc.connect(signers[i]).approve(insuranceManager.address, hre.ethers.MaxUint256);
        await tx.wait();

        console.log(`  ✅ Approval successful! Transaction: ${tx.hash}`);

        // Verify the new allowance
        const newAllowance = await usdc.allowance(address, insuranceManager.address);
        console.log(`  💰 New Allowance: ${hre.ethers.formatUnits(newAllowance, 6)} USDC (effectively infinite)`);
        successCount++;
      } catch (error: any) {
        console.log(`  ❌ Failed to approve for ${address}:`, error.message);
      }
    }

    console.log(`\n🎉 Setup complete! ${successCount}/${setupCount} accounts have infinite USDC allowance.`);
    console.log(`📝 Note: For MetaMask accounts, USDC approval will be handled automatically in the frontend.`);
  } catch (error) {
    console.error("❌ Error setting up test accounts:", error);
    throw error;
  }
};

func.tags = ["test-accounts"];
func.dependencies = ["usdc-approval"];

export default func;
