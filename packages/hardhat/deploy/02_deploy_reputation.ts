import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployReputation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Reputation", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployReputation;
deployReputation.tags = ["Reputation"];
