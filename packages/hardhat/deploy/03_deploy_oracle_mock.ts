import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployOracleMock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("OracleMock", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployOracleMock;
deployOracleMock.tags = ["OracleMock"];
