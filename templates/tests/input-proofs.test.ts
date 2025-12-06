import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @title Input Proofs Test Suite
 * @purpose This example explains input proofs in FHEVM - why they're needed and how to use them correctly
 * @chapter Understanding Input Proofs
 */
describe("InputProofs", function () {
  /**
   * @example What Are Input Proofs
   * @note Input proofs are cryptographic proofs that validate encrypted inputs are properly formed and authorized
   */
  it("Should compile the InputProofs contract", async function () {
    const InputProofs = await ethers.getContractFactory("InputProofs");
    expect(InputProofs).to.not.be.undefined;
  });

  /**
   * @chapter Why Input Proofs Are Needed
   * @example Security and Validation
   * @note Input proofs prevent malicious or malformed encrypted data from being processed
   */
  it("Should deploy InputProofs contract", async function () {
    const InputProofs = await ethers.getContractFactory("InputProofs");
    const contract = await InputProofs.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.be.properAddress;
  });

  /**
   * @chapter Using Input Proofs Correctly
   * @example Store Value With Proof
   * @note The storeWithProof function demonstrates proper input proof usage
   */
  it("Should have storeWithProof function", async function () {
    const InputProofs = await ethers.getContractFactory("InputProofs");
    const contract = await InputProofs.deploy();
    await contract.waitForDeployment();

    expect(contract.storeWithProof).to.be.a('function');
  });

  /**
   * @example Multiple Input Proofs
   * @note When using multiple encrypted inputs, each needs its own proof
   */
  it("Should have addWithProofs function", async function () {
    const InputProofs = await ethers.getContractFactory("InputProofs");
    const contract = await InputProofs.deploy();
    await contract.waitForDeployment();

    expect(contract.addWithProofs).to.be.a('function');
  });

  /**
   * @chapter Best Practices
   * @example Always Validate Proofs
   * @note Never skip input proof validation in production code
   */
  it("Should have getValue function", async function () {
    const InputProofs = await ethers.getContractFactory("InputProofs");
    const contract = await InputProofs.deploy();
    await contract.waitForDeployment();

    expect(contract.getValue).to.be.a('function');
  });
});
