import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Public Decrypt Single Value Test Suite
 * @purpose Demonstrates public decryption where encrypted values are revealed on-chain for everyone to see
 * @chapter Public Decryption
 */
describe('PublicDecryptSingle', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the PublicDecryptSingle contract compiles successfully
   */
  it('Should compile the PublicDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    expect(Contract).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment of the public decryption contract
   */
  it('Should deploy PublicDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Score Management
   * @example Set Encrypted Score
   * @note Demonstrates storing an encrypted score that can later be revealed publicly
   */
  it('Should have setScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.setScore).to.be.a('function');
  });

  /**
   * @example Get Encrypted Score
   * @note Returns the encrypted score before it's revealed
   */
  it('Should have getEncryptedScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getEncryptedScore).to.be.a('function');
  });

  /**
   * @chapter Public Revelation
   * @example Reveal Score Publicly
   * @note Uses FHE.decrypt() to reveal the encrypted score on-chain - becomes visible to everyone
   */
  it('Should have revealScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.revealScore).to.be.a('function');
  });

  /**
   * @example Get Public Score
   * @note Anyone can view the revealed score after decryption
   */
  it('Should have getPublicScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.getPublicScore).to.be.a('function');
  });

  /**
   * @chapter Threshold Checks
   * @example Check Score Threshold
   * @note Demonstrates revealing and checking a value in one transaction
   */
  it('Should have isScoreAbove function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    expect(contract.isScoreAbove).to.be.a('function');
  });

  /**
   * @note Public decryption uses FHE.decrypt() which reveals the value on-chain
   * @note Once revealed, the value is permanently public and visible to everyone
   * @note Use public decryption only when you want to make encrypted data public
   */
  it('Should support public decryption pattern', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Verify public decryption functions exist
    expect(contract.revealScore).to.be.a('function');
    expect(contract.getPublicScore).to.be.a('function');
  });
});
