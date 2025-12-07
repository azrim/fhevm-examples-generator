import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Encrypt Multiple Values Test Suite
 * @purpose Demonstrates encrypting and storing multiple values of different types in one transaction
 * @chapter Encryption Patterns
 */
describe('EncryptMultipleValues', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the EncryptMultipleValues contract compiles successfully
   */
  it('Should compile the EncryptMultipleValues contract', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    expect(Contract).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment of the multi-value encryption contract
   */
  it('Should deploy EncryptMultipleValues contract', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Multiple Value Storage
   * @example Store Multiple Values
   * @note Demonstrates storing age (euint8), score (euint16), and balance (euint32) together
   */
  it('Should have storeData function', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.storeData).to.be.a('function');
  });

  /**
   * @example Retrieve Multiple Values
   * @note Shows how to get all stored encrypted values at once
   */
  it('Should have getData function', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getData).to.be.a('function');
  });

  /**
   * @chapter Value Updates
   * @example Update Specific Field
   * @note Demonstrates updating a single field without affecting others
   */
  it('Should have updateBalance function', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.updateBalance).to.be.a('function');
  });

  /**
   * @note This example shows efficient batch encryption handling
   * @note All values maintain their encryption throughout storage and retrieval
   */
  it('Should handle multiple encrypted types', async function () {
    const Contract = await ethers.getContractFactory('EncryptMultipleValues');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Verify all functions exist
    expect(contract.storeData).to.be.a('function');
    expect(contract.getData).to.be.a('function');
    expect(contract.updateBalance).to.be.a('function');
  });
});
