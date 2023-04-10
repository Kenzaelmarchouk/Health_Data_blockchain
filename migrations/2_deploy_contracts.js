const HealthData = artifacts.require("HealthData");

module.exports = function (deployer) {
  deployer.deploy(HealthData);
};