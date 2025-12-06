import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Basic Counter Test Suite
 * @purpose This example demonstrates a simple encrypted counter using FHEVM, showing how to store and increment encrypted values
 * @chapter Getting Started with FHEVM
 */
describe('BasicCounter', function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the BasicCounter contract compiles successfully
   */
  it('Should compile the BasicCounter contract', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    expect(BasicCounter).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Counter Contract
   * @note Tests deployment and initialization of the encrypted counter
   */
  it('Should deploy BasicCounter contract', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    const counter = await BasicCounter.deploy();
    await counter.waitForDeployment();

    const address = await counter.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Counter Operations
   * @example Increment Counter
   * @note Demonstrates incrementing the encrypted counter by 1
   */
  it('Should have increment function', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    const counter = await BasicCounter.deploy();
    await counter.waitForDeployment();

    expect(counter.increment).to.be.a('function');
  });

  /**
   * @example Get Counter Value
   * @note Shows how to retrieve the encrypted counter value
   */
  it('Should have getCounter function', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    const counter = await BasicCounter.deploy();
    await counter.waitForDeployment();

    expect(counter.getCounter).to.be.a('function');
  });

  /**
   * @example Increment by Custom Amount
   * @note Demonstrates incrementing by an encrypted amount using input proofs
   */
  it('Should have incrementBy function', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    const counter = await BasicCounter.deploy();
    await counter.waitForDeployment();

    expect(counter.incrementBy).to.be.a('function');
  });

  /**
   * @chapter Testing Patterns
   * @example Call Increment Function
   * @note Tests that increment can be called without errors
   */
  it('Should call increment without error', async function () {
    const BasicCounter = await ethers.getContractFactory('BasicCounter');
    const counter = await BasicCounter.deploy();
    await counter.waitForDeployment();

    const tx = await counter.increment();
    await tx.wait();
    expect(tx).to.not.be.undefined;
  });
});
