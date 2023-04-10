var HealthData = artifacts.require("./HealthData.sol");

module.exports = function(deployer) {
  deployer.deploy(HealthData);
};
