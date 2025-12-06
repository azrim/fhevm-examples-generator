// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title BlindAuction
 * @notice A sealed-bid auction where bids remain encrypted until the auction ends
 * @dev Demonstrates encrypted state management and conditional logic with FHE
 */
contract BlindAuction is ZamaEthereumConfig {
  address public beneficiary;
  euint32 private highestBid;
  address public highestBidder;
  mapping(address => euint32) private bids;
  bool public ended;
  uint256 public auctionEndTime;

  event AuctionEnded(address winner);
  event BidPlaced(address bidder);

  constructor(address _beneficiary, uint256 biddingTime) {
    beneficiary = _beneficiary;
    auctionEndTime = block.timestamp + biddingTime;
  }

  /**
   * @notice Place a sealed bid in the auction
   * @param inputBid The encrypted bid amount
   * @param inputProof Proof that the encrypted value is valid
   */
  function bid(externalEuint32 inputBid, bytes calldata inputProof) public {
    require(block.timestamp < auctionEndTime, 'Auction ended');
    require(!ended, 'Auction already ended');

    euint32 bidAmount = FHE.fromExternal(inputBid, inputProof);

    bids[msg.sender] = bidAmount;
    FHE.allowThis(bidAmount);
    FHE.allow(bidAmount, msg.sender);

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
   * @notice End the auction
   * @dev Only callable after auction end time
   */
  function endAuction() public {
    require(block.timestamp >= auctionEndTime, 'Auction not yet ended');
    require(!ended, 'Auction already ended');

    ended = true;
    emit AuctionEnded(msg.sender);
  }
}
