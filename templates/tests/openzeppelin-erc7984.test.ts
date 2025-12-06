/**
 * @title OpenZeppelin ERC-7984 Confidential Token
 * @purpose Demonstrates a confidential ERC20 token with encrypted balances and transfers
 * @chapter Advanced Examples
 * @example Confidential Token Standard
 * This example shows how to implement ERC-7984 confidential tokens:
 * - Encrypted token balances that remain private
 * - Confidential transfers between addresses
 * - Approval and transferFrom with encrypted amounts
 * - Total supply tracking with encryption
 * @note This follows the ERC-7984 standard for confidential tokens
 */

import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ConfidentialERC20', function () {
  it('Should compile the ConfidentialERC20 contract', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    expect(ConfidentialERC20).to.not.be.undefined;
  });

  it('Should deploy ConfidentialERC20 contract', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(await token.name()).to.equal('Confidential Token');
    expect(await token.symbol()).to.equal('CTKN');
    expect(await token.decimals()).to.equal(18);
  });

  it('Should have mint function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.mint).to.be.a('function');
  });

  it('Should have transfer function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.transfer).to.be.a('function');
  });

  it('Should have approve function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.approve).to.be.a('function');
  });

  it('Should have transferFrom function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.transferFrom).to.be.a('function');
  });

  it('Should have balanceOf function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.balanceOf).to.be.a('function');
  });

  it('Should have allowance function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.allowance).to.be.a('function');
  });

  it('Should have getTotalSupply function', async function () {
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');
    const token = await ConfidentialERC20.deploy('Confidential Token', 'CTKN', 18);
    await token.waitForDeployment();

    expect(token.getTotalSupply).to.be.a('function');
  });
});
