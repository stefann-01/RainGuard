import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Hardcoded addresses from deployment
  const insuranceManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Specific addresses to check
  const specificAddresses = [
    "0x602FA0DFe6E23DEF2357924Ad7823db240c474a4",
    "0xa6CDB77F78fBfaC98Fc7fE7562c0Ac2A95Ec25AA",
  ];

  // Get USDC contract
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);

  console.log(`\n🔐 Checking USDC allowance for specific addresses...`);
  console.log(`USDC Address: ${usdcAddress}`);
  console.log(`InsuranceManager Address: ${insuranceManagerAddress}`);
  console.log(`Deployer: ${deployer.address}`);

  // Check and approve for deployer
  console.log(`\n📊 Checking deployer allowance...`);
  const deployerAllowance = await usdc.allowance(deployer.address, insuranceManagerAddress);
  console.log(`Current Allowance: ${ethers.formatUnits(deployerAllowance, 6)} USDC`);

  if (deployerAllowance === 0n) {
    console.log(`Approving infinite amount for deployer...`);
    const infiniteAmount = ethers.MaxUint256;

    try {
      const tx = await usdc.approve(insuranceManagerAddress, infiniteAmount);
      await tx.wait();
      console.log(`✅ Infinite approval successful for deployer! Transaction: ${tx.hash}`);
    } catch (error) {
      console.error(`❌ Approval failed for deployer:`, error);
    }
  } else {
    console.log(`✅ Deployer already has sufficient allowance`);
  }

  // Check specific addresses
  console.log(`\n📊 Checking specific addresses...`);

  for (const address of specificAddresses) {
    console.log(`\n📍 ${address}:`);

    // Check balance
    const balance = await usdc.balanceOf(address);
    console.log(`  💰 Balance: ${ethers.formatUnits(balance, 6)} USDC`);

    // Check allowance
    const currentAllowance = await usdc.allowance(address, insuranceManagerAddress);
    console.log(`  🔐 Allowance: ${ethers.formatUnits(currentAllowance, 6)} USDC`);

    if (currentAllowance === 0n) {
      console.log(`  ❌ No allowance - needs manual approval`);
      console.log(`  📝 Manual approval steps for ${address}:`);
      console.log(`    1. Connect MetaMask wallet (${address}) to frontend`);
      console.log(`    2. Go to: http://localhost:3000/debug`);
      console.log(`    3. Find MockUSDC contract`);
      console.log(`    4. Call approve function:`);
      console.log(`       - spender: ${insuranceManagerAddress}`);
      console.log(
        `       - amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935 (infinite)`,
      );
    } else if (currentAllowance < ethers.parseUnits("100000", 6)) {
      console.log(`  ⚠️  Low allowance - may need more approval`);
      console.log(`  📝 To approve more, call approve with amount: 100000000000 (100,000 USDC)`);
    } else {
      console.log(`  ✅ Sufficient allowance`);
    }
  }

  console.log(`\n🎉 Allowance check complete!`);
  console.log(`💡 For addresses without allowance, use the manual approval steps above.`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
