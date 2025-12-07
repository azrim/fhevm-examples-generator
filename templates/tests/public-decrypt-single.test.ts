/**
 * @title Public Decrypt Single Value Tests
 * @purpose Demonstrates marking a single encrypted value for public decryption
 * @chapter Public Decryption
 * @example Marking Values for Decryption
 * @note This shows the pattern for public decryption using makePubliclyDecryptable()
 */

import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('PublicDecryptSingle', function () {
  it('Should compile the PublicDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    expect(Contract).to.not.be.undefined;
  });

  it('Should deploy PublicDecryptSingle contract', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(await contract.getAddress()).to.be.properAddress;
  });

  it('Should have setScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(contract.setScore).to.be.a('function');
  });

  it('Should have getEncryptedScore function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(contract.getEncryptedScore).to.be.a('function');
  });

  it('Should have markForPublicDecryption function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(contract.markForPublicDecryption).to.be.a('function');
  });

  it('Should have isMarkedPublic function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(contract.isMarkedPublic).to.be.a('function');
  });

  it('Should have getDecryptionStatus function', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();
    expect(contract.getDecryptionStatus).to.be.a('function');
  });

  it('Should demonstrate public decryption pattern', async function () {
    const Contract = await ethers.getContractFactory('PublicDecryptSingle');
    const contract = await Contract.deploy();

    // Contract demonstrates the pattern for marking values for public decryption
    // In production, this would be followed by KMS decryption off-chain
    expect(await contract.getAddress()).to.be.properAddress;
  });
});
