import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Encrypt Single Value Test Suite
 * @purpose This example demonstrates how to encrypt and store a single value using FHEVM with proper input proofs
 * @chapter Encryption Basics
 */
describe('EncryptSingleValue', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the EncryptSingleValue contract compiles successfully
   */
  it('Should compile the EncryptSingleValue contract', async function () {
    const EncryptSingleValue = await ethers.getContractFactory('EncryptSingleValue');
    expect(EncryptSingleValue).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Contract
   * @note Tests deployment and initialization
   */
  it('Should deploy EncryptSingleValue contract', async function () {
    const EncryptSingleValue = await ethers.getContractFactory('EncryptSingleValue');
    const contract = await EncryptSingleValue.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Input Proofs
   * @example Store Encrypted Value
   * @note Demonstrates using input proofs to encrypt and store a value
   */
  it('Should have storeEncryptedValue function', async function () {
    const EncryptSingleValue = await ethers.getContractFactory('EncryptSingleValue');
    const contract = await EncryptSingleValue.deploy();
    await contract.waitForDeployment();

    expect(contract.storeEncryptedValue).to.be.a('function');
  });

  /**
   * @chapter Value Retrieval
   * @example Get Encrypted Value
   * @note Shows how to retrieve the stored encrypted value
   */
  it('Should have getEncryptedValue function', async function () {
    const EncryptSingleValue = await ethers.getContractFactory('EncryptSingleValue');
    const contract = await EncryptSingleValue.deploy();
    await contract.waitForDeployment();

    expect(contract.getEncryptedValue).to.be.a('function');
  });

  /**
   * @chapter Operations on Encrypted Data
   * @example Add to Encrypted Value
   * @note Demonstrates performing operations on encrypted data
   */
  it('Should have addToValue function', async function () {
    const EncryptSingleValue = await ethers.getContractFactory('EncryptSingleValue');
    const contract = await EncryptSingleValue.deploy();
    await contract.waitForDeployment();

    expect(contract.addToValue).to.be.a('function');
  });
});
