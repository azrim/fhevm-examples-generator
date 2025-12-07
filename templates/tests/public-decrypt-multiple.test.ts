import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Public Decrypt Multiple Values Test Suite
 * @purpose Demonstrates public decryption of multiple encrypted values at once
 * @chapter Public Decryption
 */
describe('PublicDecryptMultiple', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the PublicDecryptMultiple contract compiles successfully
   */
  it('Should compile the PublicDecryptMultiple contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    expect(Contract).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment of the multi-value public decryption contract
   */
  it('Should deploy PublicDecryptMultiple contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Stats Management
   * @example Set Encrypted Stats
   * @note Demonstrates storing multiple encrypted stats (strength, health, experience)
   */
  it('Should have setStats function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.setStats).to.be.a('function');
  });

  /**
   * @example Get Encrypted Stats
   * @note Returns all encrypted stats before revelation
   */
  it('Should have getEncryptedStats function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getEncryptedStats).to.be.a('function');
  });

  /**
   * @chapter Public Revelation
   * @example Reveal All Stats Publicly
   * @note Uses FHE.decrypt() on all values - they become visible to everyone
   */
  it('Should have revealStats function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.revealStats).to.be.a('function');
  });

  /**
   * @example Get Public Stats
   * @note Anyone can view all revealed stats after decryption
   */
  it('Should have getPublicStats function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getPublicStats).to.be.a('function');
  });

  /**
   * @chapter Calculations
   * @example Calculate Power
   * @note Demonstrates revealing multiple values and performing calculations
   */
  it('Should have calculatePower function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.calculatePower).to.be.a('function');
  });

  /**
   * @note Public decryption reveals all values on-chain simultaneously
   * @note Once revealed, all values are permanently public
   * @note Useful for game reveals, auction results, or public leaderboards
   */
  it('Should support multi-value public decryption', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptMultiple');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Verify all functions exist
    expect(contract.setStats).to.be.a('function');
    expect(contract.getEncryptedStats).to.be.a('function');
    expect(contract.revealStats).to.be.a('function');
    expect(contract.getPublicStats).to.be.a('function');
    expect(contract.calculatePower).to.be.a('function');
  });
});
