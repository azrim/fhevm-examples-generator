/**
 * @title Blind Auction Example
 * @purpose Demonstrates a sealed-bid auction where bids remain encrypted until the auction ends
 * @chapter Advanced Examples
 * @example Sealed-Bid Auction
 * This example shows how to build a blind auction where:
 * - Bidders submit encrypted bids that remain private
 * - The highest bid is tracked without revealing individual bids
 * - The auction can be ended to reveal the winner
 * @note This example requires FHE runtime for full functionality
 */

import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('BlindAuction', function () {
  it('Should compile the BlindAuction contract', async function () {
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    expect(BlindAuction).to.not.be.undefined;
  });

  it('Should deploy BlindAuction contract', async function () {
    const [owner] = await ethers.getSigners();
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    const biddingTime = 3600; // 1 hour
    const auction = await BlindAuction.deploy(owner.address, biddingTime);
    await auction.waitForDeployment();

    expect(await auction.beneficiary()).to.equal(owner.address);
    expect(await auction.ended()).to.equal(false);
  });

  it('Should have bid function', async function () {
    const [owner] = await ethers.getSigners();
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    const auction = await BlindAuction.deploy(owner.address, 3600);
    await auction.waitForDeployment();

    expect(auction.bid).to.be.a('function');
  });

  it('Should have getBid function', async function () {
    const [owner] = await ethers.getSigners();
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    const auction = await BlindAuction.deploy(owner.address, 3600);
    await auction.waitForDeployment();

    expect(auction.getBid).to.be.a('function');
  });

  it('Should have endAuction function', async function () {
    const [owner] = await ethers.getSigners();
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    const auction = await BlindAuction.deploy(owner.address, 3600);
    await auction.waitForDeployment();

    expect(auction.endAuction).to.be.a('function');
  });

  it('Should have getHighestBid function', async function () {
    const [owner] = await ethers.getSigners();
    const BlindAuction = await ethers.getContractFactory('BlindAuction');
    const auction = await BlindAuction.deploy(owner.address, 3600);
    await auction.waitForDeployment();

    expect(auction.getHighestBid).to.be.a('function');
  });
});
