import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Addresses to send ETH to
  const targetAddresses = [
    "0x35de0a6E396a9d6F6092ecef4E1F2E7bbc5Ae9ce",
    "0x602FA0DFe6E23DEF2357924Ad7823db240c474a4",
    "0xa6CDB77F78fBfaC98Fc7fE7562c0Ac2A95Ec25AA",
  ];

  console.log(`\n💰 Fauceting 10 ETH to ${targetAddresses.length} addresses...`);
  console.log(`From: ${deployer.address}`);

  // Check deployer's balance
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer ETH Balance: ${ethers.formatEther(deployerBalance)} ETH`);

  const totalNeeded = ethers.parseEther("30"); // 10 ETH per address * 3 addresses

  if (deployerBalance < totalNeeded) {
    console.log(`❌ Deployer doesn't have enough ETH. Need 30 ETH, has ${ethers.formatEther(deployerBalance)} ETH`);
    return;
  }

  // Send 10 ETH to each address
  const amount = ethers.parseEther("10");

  for (const targetAddress of targetAddresses) {
    console.log(`\n💸 Sending 10 ETH to ${targetAddress}...`);

    try {
      const tx = await deployer.sendTransaction({
        to: targetAddress,
        value: amount,
      });

      await tx.wait();

      console.log(`✅ Successfully sent 10 ETH to ${targetAddress}`);
      console.log(`Transaction hash: ${tx.hash}`);

      // Check new balance
      const newBalance = await ethers.provider.getBalance(targetAddress);
      console.log(`New ETH Balance for ${targetAddress}: ${ethers.formatEther(newBalance)} ETH`);
    } catch (error) {
      console.error(`❌ Faucet failed for ${targetAddress}:`, error);
    }
  }

  console.log(`\n🎉 Faucet complete! Sent 10 ETH to ${targetAddresses.length} addresses.`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
