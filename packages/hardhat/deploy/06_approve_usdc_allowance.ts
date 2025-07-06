import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { get } = hre.deployments;

  console.log("\n 🔐 Setting up USDC allowance for deployer...");

  try {
    // Get the deployed contracts
    const mockUSDC = await get("MockUSDC");
    const insuranceManager = await get("InsuranceManager");

    // Get USDC contract instance
    const usdc = await hre.ethers.getContractAt("IERC20", mockUSDC.address);

    console.log(`USDC Address: ${mockUSDC.address}`);
    console.log(`InsuranceManager Address: ${insuranceManager.address}`);
    console.log(`Deployer: ${deployer}`);

    // Check current allowance
    const currentAllowance = await usdc.allowance(deployer, insuranceManager.address);
    console.log(`Current Allowance: ${hre.ethers.formatUnits(currentAllowance, 6)} USDC`);

    // If allowance is already infinite, skip
    if (currentAllowance === hre.ethers.MaxUint256) {
      console.log("✅ Infinite allowance already set, skipping...");
      return;
    }

    // Approve infinite amount
    console.log("Approving infinite USDC allowance...");
    const tx = await usdc.approve(insuranceManager.address, hre.ethers.MaxUint256);
    await tx.wait();

    console.log(`✅ Infinite approval successful! Transaction: ${tx.hash}`);

    // Verify the new allowance
    const newAllowance = await usdc.allowance(deployer, insuranceManager.address);
    console.log(`New Allowance: ${hre.ethers.formatUnits(newAllowance, 6)} USDC (effectively infinite)`);
  } catch (error) {
    console.error("❌ Error setting up USDC allowance:", error);
    throw error;
  }
};

func.tags = ["usdc-approval"];
func.dependencies = ["InsuranceManager"];

export default func;
