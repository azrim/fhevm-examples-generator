// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import 'fhevm/lib/TFHE.sol';
import 'fhevm/gateway/GatewayCaller.sol';

/**
 * @title BlindAuction
 * @notice A sealed-bid auction where bids remain encrypted until the auction ends
 * @dev Demonstrates encrypted state management and conditional logic with FHE
 */
contract BlindAuction is GatewayCaller {
  address public beneficiary;
  euint32 private highestBid;
  address public highestBidder;
  mapping(address => euint32) private bids;
  bool public ended;
  uint256 public auctionEndTime;

  event AuctionEnded(address winner, uint256 amount);
  event BidPlaced(address bidder);

  constructor(address _beneficiary, uint256 biddingTime) {
    beneficiary = _beneficiary;
    auctionEndTime = block.timestamp + biddingTime;
    highestBid = TFHE.asEuint32(0);
  }

  /**
   * @notice Place a sealed bid in the auction
   * @param encryptedBid The encrypted bid amount
   * @param inputProof Proof that the encrypted value is valid
   */
  function bid(einput encryptedBid, bytes calldata inputProof) public {
    require(block.timestamp < auctionEndTime, 'Auction ended');
    require(!ended, 'Auction already ended');

    euint32 bidAmount = TFHE.asEuint32(encryptedBid, inputProof);
    TFHE.allowThis(bidAmount);
    TFHE.allow(bidAmount, msg.sender);

    bids[msg.sender] = bidAmount;

    // Update highest bid if this bid is higher
    ebool isHigher = TFHE.gt(bidAmount, highestBid);
    highestBid = TFHE.select(isHigher, bidAmount, highestBid);
    highestBidder = TFHE.decrypt(isHigher) ? msg.sender : highestBidder;

    emit BidPlaced(msg.sender);
  }

  /**
   * @notice Get the encrypted bid for a specific address
   * @param bidder The address to query
   * @return The encrypted bid amount
   */
  function getBid(address bidder) public view returns (euint32) {
    return bids[bidder];
  }

  /**
   * @notice End the auction and reveal the winner
   * @dev Only callable after auction end time
   */
  function endAuction() public {
    require(block.timestamp >= auctionEndTime, 'Auction not yet ended');
    require(!ended, 'Auction already ended');

    ended = true;
    uint32 winningBid = TFHE.decrypt(highestBid);
    emit AuctionEnded(highestBidder, winningBid);
  }

  /**
   * @notice Get the current highest bid (encrypted)
   * @return The encrypted highest bid
   */
  function getHighestBid() public view returns (euint32) {
    return highestBid;
  }
}
