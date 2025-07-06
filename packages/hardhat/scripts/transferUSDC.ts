import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const targetAddress = "0xa6CDB77F78fBfaC98Fc7fE7562c0Ac2A95Ec25AA"; // Your MetaMask address
  const insuranceManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  console.log(`\n💰 Transferring USDC to ${targetAddress}...`);
  console.log(`Using deployer: ${deployer.address}`);

  // Get USDC contract
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);

  // Check deployer's balance
  const deployerBalance = await usdc.balanceOf(deployer.address);
  console.log(`\n📊 Deployer USDC Balance: ${ethers.formatUnits(deployerBalance, 6)} USDC`);

  if (deployerBalance < ethers.parseUnits("100000", 6)) {
    console.log(`❌ Deployer doesn't have enough USDC to transfer`);
    return;
  }

  // Transfer USDC to target address
  const transferAmount = ethers.parseUnits("100000", 6); // 100,000 USDC
  console.log(`\n💸 Transferring ${ethers.formatUnits(transferAmount, 6)} USDC to ${targetAddress}...`);

  try {
    const transferTx = await usdc.transfer(targetAddress, transferAmount);
    await transferTx.wait();

    console.log(`✅ Successfully transferred ${ethers.formatUnits(transferAmount, 6)} USDC to ${targetAddress}`);

    // Check new balance
    const newBalance = await usdc.balanceOf(targetAddress);
    console.log(`New USDC Balance for ${targetAddress}: ${ethers.formatUnits(newBalance, 6)} USDC`);
  } catch (transferError: any) {
    console.log(`❌ Transfer failed: ${transferError.message}`);
    return;
  }

  // Now check and set up allowance
  console.log(`\n🔐 Setting up USDC allowance...`);

  const currentAllowance = await usdc.allowance(targetAddress, insuranceManagerAddress);
  console.log(`Current Allowance: ${ethers.formatUnits(currentAllowance, 6)} USDC`);

  if (currentAllowance === 0n) {
    console.log(`\n❌ No USDC allowance! Need to approve USDC for InsuranceManager.`);
    console.log(`💡 Since we don't have the private key for ${targetAddress}, you need to approve manually.`);
    console.log(`\n📝 Manual approval steps:`);
    console.log(`1. Connect your MetaMask wallet (${targetAddress}) to the frontend`);
    console.log(`2. Go to the debug page: http://localhost:3000/debug`);
    console.log(`3. Find the MockUSDC contract`);
    console.log(`4. Call the approve function with:`);
    console.log(`   - spender: ${insuranceManagerAddress}`);
    console.log(
      `   - amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935 (infinite)`,
    );
    console.log(`5. Or call approve with a specific amount like 100000000000 (100,000 USDC)`);
  } else if (currentAllowance < ethers.parseUnits("100000", 6)) {
    console.log(`\n⚠️  Low USDC allowance. Current: ${ethers.formatUnits(currentAllowance, 6)} USDC`);
    console.log(`💡 You may need to approve more USDC for larger transactions.`);
    console.log(`📝 To approve more, call approve with amount: 100000000000 (100,000 USDC)`);
  } else {
    console.log(`\n✅ Sufficient USDC allowance! You should be able to fund pools.`);
  }

  console.log(`\n🎉 Setup complete!`);
  console.log(`✅ ${targetAddress} now has ${ethers.formatUnits(transferAmount, 6)} USDC`);
  console.log(`📝 Next step: Approve USDC allowance manually using the steps above`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
