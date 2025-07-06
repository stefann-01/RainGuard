import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Hardcoded addresses from deployment
  const insuranceManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get USDC contract
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);

  console.log(`\n🔐 Approving USDC for InsuranceManager...`);
  console.log(`USDC Address: ${usdcAddress}`);
  console.log(`InsuranceManager Address: ${insuranceManagerAddress}`);
  console.log(`User: ${deployer.address}`);

  // Check current allowance
  const currentAllowance = await usdc.allowance(deployer.address, insuranceManagerAddress);
  console.log(`Current Allowance: ${ethers.formatUnits(currentAllowance, 6)} USDC`);

  // Approve infinite amount (maximum uint256)
  const infiniteAmount = ethers.MaxUint256;
  console.log(`Approving: INFINITE (${infiniteAmount}) USDC`);

  try {
    const tx = await usdc.approve(insuranceManagerAddress, infiniteAmount);
    await tx.wait();

    console.log(`✅ Infinite approval successful! Transaction: ${tx.hash}`);

    // Check new allowance
    const newAllowance = await usdc.allowance(deployer.address, insuranceManagerAddress);
    console.log(`New Allowance: ${ethers.formatUnits(newAllowance, 6)} USDC (effectively infinite)`);
  } catch (error) {
    console.error(`❌ Approval failed:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
