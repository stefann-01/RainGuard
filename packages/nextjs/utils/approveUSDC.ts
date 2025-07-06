import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useApproveUSDC = () => {
  const { writeContractAsync: approveAsync } = useScaffoldWriteContract({
    contractName: "MockUSDC",
  });

  const approveUSDC = async (amount: bigint) => {
    try {
      // InsuranceManager contract address (hardcoded for now)
      const insuranceManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

      console.log(`🔐 Approving USDC allowance: ${amount} for InsuranceManager...`);

      const tx = await approveAsync({
        functionName: "approve",
        args: [insuranceManagerAddress, amount],
      });

      console.log(`✅ USDC approval successful: ${tx}`);
      return tx;
    } catch (error) {
      console.error("❌ USDC approval failed:", error);
      throw error;
    }
  };

  return { approveUSDC };
};
