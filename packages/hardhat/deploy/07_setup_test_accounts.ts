import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { get } = hre.deployments;

  console.log("\n 🧪 Setting up test accounts with USDC and ETH...");

  try {
    // Get the deployed contracts
    const mockUSDC = await get("MockUSDC");
    const insuranceManager = await get("InsuranceManager");

    // Get USDC contract instance
    const usdc = await hre.ethers.getContractAt("IERC20", mockUSDC.address);

    console.log(`USDC Address: ${mockUSDC.address}`);
    console.log(`InsuranceManager Address: ${insuranceManager.address}`);

    // Get deployer signer
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);

    // Specific addresses to set up
    const specificAddresses = [
      "0x602FA0DFe6E23DEF2357924Ad7823db240c474a4",
      "0xa6CDB77F78fBfaC98Fc7fE7562c0Ac2A95Ec25AA",
      "0x35de0a6E396a9d6F6092ecef4E1F2E7bbc5Ae9ce",
    ];

    // ===== ETH FAUCET =====
    console.log(`\n💰 Fauceting ETH to ${specificAddresses.length} addresses...`);

    // Check deployer's ETH balance
    const deployerEthBalance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`Deployer ETH Balance: ${hre.ethers.formatEther(deployerEthBalance)} ETH`);

    const ethAmount = hre.ethers.parseEther("10"); // 10 ETH per address
    const totalEthNeeded = ethAmount * BigInt(specificAddresses.length);

    if (deployerEthBalance < totalEthNeeded) {
      console.log(`❌ Deployer doesn't have enough ETH. Need ${hre.ethers.formatEther(totalEthNeeded)} ETH`);
      return;
    }

    // Send ETH to each address
    for (const address of specificAddresses) {
      console.log(`\n💸 Sending 10 ETH to ${address}...`);

      try {
        const ethTx = await deployer.sendTransaction({
          to: address,
          value: ethAmount,
        });

        await ethTx.wait();

        const newEthBalance = await hre.ethers.provider.getBalance(address);
        console.log(`✅ ETH sent! New balance: ${hre.ethers.formatEther(newEthBalance)} ETH`);
      } catch (error: any) {
        console.log(`❌ ETH transfer failed for ${address}: ${error.message}`);
      }
    }

    // ===== USDC TRANSFER =====
    // Check deployer's USDC balance
    const deployerBalance = await usdc.balanceOf(deployer.address);
    console.log(`\n📊 Deployer USDC Balance: ${hre.ethers.formatUnits(deployerBalance, 6)} USDC`);

    const transferAmount = hre.ethers.parseUnits("100000", 6); // 100,000 USDC per address
    const totalNeeded = transferAmount * BigInt(specificAddresses.length);

    if (deployerBalance < totalNeeded) {
      console.log(`❌ Deployer doesn't have enough USDC. Need ${hre.ethers.formatUnits(totalNeeded, 6)} USDC`);
      return;
    }

    console.log(`\n💰 Transferring ${hre.ethers.formatUnits(transferAmount, 6)} USDC to each address...`);

    // Transfer USDC to specific addresses
    for (const address of specificAddresses) {
      console.log(`\n💸 Transferring USDC to ${address}...`);

      try {
        const transferTx = await usdc.transfer(address, transferAmount);
        await transferTx.wait();

        const newBalance = await usdc.balanceOf(address);
        console.log(`✅ USDC transfer successful! New balance: ${hre.ethers.formatUnits(newBalance, 6)} USDC`);
      } catch (error: any) {
        console.log(`❌ USDC transfer failed for ${address}: ${error.message}`);
      }
    }

    // ===== USDC ALLOWANCE SETUP =====
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

    // Check allowance status for specific addresses
    console.log(`\n📊 Checking allowance status for specific addresses...`);

    for (const address of specificAddresses) {
      const currentAllowance = await usdc.allowance(address, insuranceManager.address);
      const balance = await usdc.balanceOf(address);
      const ethBalance = await hre.ethers.provider.getBalance(address);

      console.log(`\n📍 ${address}:`);
      console.log(`  💰 USDC Balance: ${hre.ethers.formatUnits(balance, 6)} USDC`);
      console.log(`  ⚡ ETH Balance: ${hre.ethers.formatEther(ethBalance)} ETH`);
      console.log(`  🔐 USDC Allowance: ${hre.ethers.formatUnits(currentAllowance, 6)} USDC`);

      if (currentAllowance === 0n) {
        console.log(`  ❌ No USDC allowance - needs manual approval`);
        console.log(`  📝 Manual approval needed for ${address}`);
      } else if (currentAllowance < hre.ethers.parseUnits("100000", 6)) {
        console.log(`  ⚠️  Low USDC allowance - may need more approval`);
      } else {
        console.log(`  ✅ Sufficient USDC allowance`);
      }
    }

    console.log(`\n🎉 Setup complete!`);
    console.log(`✅ ${successCount}/${setupCount} Hardhat accounts have infinite USDC allowance.`);
    console.log(`✅ All addresses have 10 ETH and 100,000 USDC.`);
    console.log(
      `📝 Note: For MetaMask accounts (${specificAddresses.join(", ")}), USDC approval will be handled automatically in the frontend.`,
    );
    console.log(`💡 If manual approval is needed, use the debug page: http://localhost:3000/debug`);
  } catch (error) {
    console.error("❌ Error setting up test accounts:", error);
    throw error;
  }
};

func.tags = ["test-accounts"];
func.dependencies = ["usdc-approval"];

export default func;
