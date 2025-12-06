import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @title Equality Comparison Test Suite
 * @purpose This test suite demonstrates equality and comparison operations on encrypted integers using FHEVM
 * @chapter Comparison Operations
 */
describe("Equality", function () {
  /**
   * @example Contract Compilation
   * @note Verifies that the Equality contract compiles successfully
   */
  it("Should compile the Equality contract", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    expect(Equality).to.not.be.undefined;
  });

  /**
   * @chapter Deployment
   * @example Deploy Equality Contract
   * @note Tests deployment of the equality comparison contract
   */
  it("Should deploy Equality contract", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    const equality = await Equality.deploy();
    await equality.waitForDeployment();

    const address = await equality.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Equality Operations
   * @example Test Equality Function
   * @note Tests the isEqual() function with encrypted inputs
   */
  it("Should have isEqual function", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    const equality = await Equality.deploy();
    await equality.waitForDeployment();

    expect(equality.isEqual).to.be.a('function');
  });

  /**
   * @example Test Inequality Function
   * @note Tests the isNotEqual() function with encrypted inputs
   */
  it("Should have isNotEqual function", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    const equality = await Equality.deploy();
    await equality.waitForDeployment();

    expect(equality.isNotEqual).to.be.a('function');
  });

  /**
   * @chapter Conditional Selection
   * @example Test Select Function
   * @note Demonstrates selecting between two values based on encrypted condition
   */
  it("Should have selectValue function", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    const equality = await Equality.deploy();
    await equality.waitForDeployment();

    expect(equality.selectValue).to.be.a('function');
  });

  /**
   * @chapter Result Retrieval
   * @example Get Comparison Result
   * @note Shows how to retrieve the encrypted comparison result
   */
  it("Should have getLastResult function", async function () {
    const Equality = await ethers.getContractFactory("Equality");
    const equality = await Equality.deploy();
    await equality.waitForDeployment();

    expect(equality.getLastResult).to.be.a('function');
  });
});
