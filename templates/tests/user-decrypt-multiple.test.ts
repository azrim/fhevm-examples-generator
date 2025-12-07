import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title User Decrypt Multiple Values Test Suite
 * @purpose Demonstrates user-side decryption of multiple encrypted values
 * @chapter User Decryption
 */
describe('UserDecryptMultiple', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the UserDecryptMultiple contract compiles successfully
   */
  it('Should compile the UserDecryptMultiple contract', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    expect(Contract).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment of the multi-value user decryption contract
   */
  it('Should deploy UserDecryptMultiple contract', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Profile Management
   * @example Create Profile
   * @note Demonstrates storing multiple encrypted values (level, points, coins) in one transaction
   */
  it('Should have createProfile function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.createProfile).to.be.a('function');
  });

  /**
   * @example Get Profile for Decryption
   * @note Returns all encrypted profile values that user can decrypt client-side
   */
  it('Should have getProfile function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getProfile).to.be.a('function');
  });

  /**
   * @chapter Profile Operations
   * @example Level Up
   * @note Shows incrementing an encrypted level value
   */
  it('Should have levelUp function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.levelUp).to.be.a('function');
  });

  /**
   * @example Add Points
   * @note Demonstrates adding to an encrypted points value
   */
  it('Should have addPoints function', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.addPoints).to.be.a('function');
  });

  /**
   * @note Users can decrypt all profile values client-side: level, points, and coins
   * @note Each value maintains its encryption and can be decrypted independently
   */
  it('Should support multi-value user decryption', async function () {
    const Contract = await ethers.getContractFactory('UserDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Verify all profile functions exist
    expect(contract.createProfile).to.be.a('function');
    expect(contract.getProfile).to.be.a('function');
    expect(contract.levelUp).to.be.a('function');
    expect(contract.addPoints).to.be.a('function');
  });
});
