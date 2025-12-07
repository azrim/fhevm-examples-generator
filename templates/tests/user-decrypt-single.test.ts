import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title User Decrypt Single Value Test Suite
 * @purpose Demonstrates user-side decryption where users decrypt values client-side using FHEVM SDK
 * @chapter User Decryption
 */
describe('UserDecryptSingle', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the UserDecryptSingle contract compiles successfully
   */
  it('Should compile the UserDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    expect(Contract).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment of the user decryption contract
   */
  it('Should deploy UserDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Balance Management
   * @example Set Encrypted Balance
   * @note Demonstrates storing an encrypted balance that only the user can decrypt
   */
  it('Should have setBalance function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.setBalance).to.be.a('function');
  });

  /**
   * @example Get Balance for Decryption
   * @note Returns encrypted balance that user can decrypt client-side with FHEVM SDK
   */
  it('Should have getBalance function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getBalance).to.be.a('function');
  });

  /**
   * @chapter Balance Operations
   * @example Add to Balance
   * @note Shows how to perform operations on encrypted values
   */
  it('Should have addToBalance function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.addToBalance).to.be.a('function');
  });

  /**
   * @chapter Permission Management
   * @example Grant Decryption Permission
   * @note Demonstrates allowing another user to decrypt your balance
   */
  it('Should have grantPermission function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.grantPermission).to.be.a('function');
  });

  /**
   * @note User decryption happens client-side using: instances.alice.decrypt(contractAddress, handle)
   * @note The contract never sees the decrypted value - privacy is maintained
   */
  it('Should support user-side decryption pattern', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Verify decryption-related functions exist
    expect(contract.getBalance).to.be.a('function');
    expect(contract.grantPermission).to.be.a('function');
  });
});
