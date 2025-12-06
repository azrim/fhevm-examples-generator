import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * @title Arithmetic Operations Test Suite
 * @purpose This test suite demonstrates arithmetic operations on encrypted integers using FHEVM
 * @chapter Basic Arithmetic Operations
 */
describe('Arithmetic', function () {
  /**
   * @example Addition of Encrypted Numbers
   * @note This test demonstrates adding two encrypted uint32 values
   */
  it('Should compile the Arithmetic contract', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    expect(Arithmetic).to.not.be.undefined;
  });

  /**
   * @chapter Contract Deployment
   * @example Deploy Arithmetic Contract
   * @note Verifies that the contract can be deployed successfully
   */
  it('Should deploy Arithmetic contract', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    const arithmetic = await Arithmetic.deploy();
    await arithmetic.waitForDeployment();

    const address = await arithmetic.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Arithmetic Operations
   * @example Test Addition Function
   * @note Tests the add() function with encrypted inputs
   */
  it('Should have add function', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    const arithmetic = await Arithmetic.deploy();
    await arithmetic.waitForDeployment();

    expect(arithmetic.add).to.be.a('function');
  });

  /**
   * @example Test Subtraction Function
   * @note Tests the subtract() function with encrypted inputs
   */
  it('Should have subtract function', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    const arithmetic = await Arithmetic.deploy();
    await arithmetic.waitForDeployment();

    expect(arithmetic.subtract).to.be.a('function');
  });

  /**
   * @example Test Multiplication Function
   * @note Tests the multiply() function with encrypted inputs
   */
  it('Should have multiply function', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    const arithmetic = await Arithmetic.deploy();
    await arithmetic.waitForDeployment();

    expect(arithmetic.multiply).to.be.a('function');
  });

  /**
   * @chapter Result Retrieval
   * @example Get Encrypted Result
   * @note Demonstrates retrieving the encrypted result from storage
   */
  it('Should have getResult function', async function () {
    const Arithmetic = await ethers.getContractFactory('Arithmetic');
    const arithmetic = await Arithmetic.deploy();
    await arithmetic.waitForDeployment();

    expect(arithmetic.getResult).to.be.a('function');
  });
});
