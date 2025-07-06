import { ethers } from "hardhat";

async function main() {
  const requestId = 15; // The request you're working with

  console.log(`\n🔍 Checking status of request ${requestId}...`);

  // Get the InsuranceManager contract
  const insuranceManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const insuranceManager = await ethers.getContractAt("InsuranceManager", insuranceManagerAddress);

  try {
    // Get basic request info
    const requestData = await insuranceManager.getRequestBasic(requestId);

    console.log(`\n📋 Request ${requestId} Details:`);
    console.log(`ID: ${requestData[0]}`);
    console.log(`Title: ${requestData[1]}`);
    console.log(`Description: ${requestData[2]}`);
    console.log(`User: ${requestData[3]}`);
    console.log(`Amount: ${ethers.formatUnits(requestData[4], 6)} USDC`);
    console.log(`Location: ${requestData[5]}`);
    console.log(`Start: ${new Date(Number(requestData[6]) * 1000).toLocaleString()}`);
    console.log(`End: ${new Date(Number(requestData[7]) * 1000).toLocaleString()}`);
    console.log(`Status: ${requestData[8]} (0=pending, 1=funding, 2=premium, 3=active, 4=expired)`);
    console.log(`Total Funded: ${ethers.formatUnits(requestData[9], 6)} USDC`);
    console.log(`Payout: ${requestData[10]}`);
    console.log(`Selected Offer ID: ${requestData[11]}`);

    // Check current time vs end time
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = Number(requestData[7]);
    const isEnded = currentTime >= endTime;

    console.log(`\n⏰ Time Analysis:`);
    console.log(`Current Time: ${new Date(currentTime * 1000).toLocaleString()}`);
    console.log(`End Time: ${new Date(endTime * 1000).toLocaleString()}`);
    console.log(`Is Ended: ${isEnded}`);

    // Check settlement conditions
    const status = Number(requestData[8]);
    const isReadyToSettle = status === 3 && isEnded;

    console.log(`\n🔍 Settlement Analysis:`);
    console.log(`Status is 3 (active): ${status === 3}`);
    console.log(`Period has ended: ${isEnded}`);
    console.log(`Ready to settle: ${isReadyToSettle}`);

    if (isReadyToSettle) {
      console.log(`\n✅ Settlement button should be visible!`);
    } else {
      console.log(`\n❌ Settlement button conditions not met:`);
      if (status !== 3) {
        console.log(`   - Status is ${status}, needs to be 3 (active)`);
      }
      if (!isEnded) {
        console.log(`   - Period has not ended yet`);
      }
    }
  } catch (error: any) {
    console.error(`❌ Error checking request ${requestId}:`, error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
