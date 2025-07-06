import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useTransferUSDC = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: transferAsync } = useScaffoldWriteContract({
    contractName: "MockUSDC",
  });

  const transferUSDC = async (amount: bigint) => {
    if (!connectedAddress) {
      throw new Error("No wallet connected");
    }

    try {
      console.log(`💰 Transferring ${amount} USDC to ${connectedAddress}...`);

      const tx = await transferAsync({
        functionName: "transfer",
        args: [connectedAddress, amount],
      });

      console.log(`✅ USDC transfer successful: ${tx}`);
      return tx;
    } catch (error) {
      console.error("❌ USDC transfer failed:", error);
      throw error;
    }
  };

  return { transferUSDC };
};
