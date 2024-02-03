// 2_deploy_contracts.js
const LoanContract = artifacts.require("LoanContract");

module.exports = function (deployer) {
  deployer.deploy(LoanContract);
};
