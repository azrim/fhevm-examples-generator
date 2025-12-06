# Blind Auction

A sealed-bid auction where bids remain encrypted until the auction ends.

## Overview

**Difficulty:** Advanced
**Concepts:** Encrypted state, sealed bids, time-based logic

## What You'll Learn

- Building complex FHE applications
- Managing encrypted bids
- Time-based contract logic
- Privacy-preserving auctions

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract BlindAuction is ZamaEthereumConfig {
    address public beneficiary;
    mapping(address => euint32) private bids;
    bool public ended;
    uint256 public auctionEndTime;

    event BidPlaced(address bidder);
    event AuctionEnded(address winner);

    constructor(address _beneficiary, uint256 biddingTime) {
        beneficiary = _beneficiary;
        auctionEndTime = block.timestamp + biddingTime;
    }

    function bid(externalEuint32 inputBid, bytes calldata inputProof) public {
        require(block.timestamp < auctionEndTime, "Auction ended");
        require(!ended, "Auction already ended");

        euint32 bidAmount = FHE.fromExternal(inputBid, inputProof);

        bids[msg.sender] = bidAmount;
        FHE.allowThis(bidAmount);
        FHE.allow(bidAmount, msg.sender);

        emit BidPlaced(msg.sender);
    }

    function getBid(address bidder) public view returns (euint32) {
        return bids[bidder];
    }

    function endAuction() public {
        require(block.timestamp >= auctionEndTime, "Auction not yet ended");
        require(!ended, "Auction already ended");

        ended = true;
        emit AuctionEnded(msg.sender);
    }
}
```

## How It Works

### 1. Auction Creation

```typescript
// Deploy with 1 hour bidding time
const auction = await BlindAuction.deploy(
  beneficiary.address,
  3600 // 1 hour in seconds
);
```

### 2. Placing Bids

```typescript
// Alice bids 100 (encrypted)
const aliceInput = await fhevm.createEncryptedInput(await auction.getAddress(), alice.address);
aliceInput.add32(100);
const aliceEncrypted = await aliceInput.encrypt();

await auction.connect(alice).bid(aliceEncrypted.handles[0], aliceEncrypted.inputProof);

// Bob bids 150 (encrypted)
const bobInput = await fhevm.credInput(await auction.getAddress(), bob.address);
bobInput.add32(150);
const bobEncrypted = await bobInput.encrypt();

await auction.connect(bob).bid(bobEncrypted.handles[0], bobEncrypted.inputProof);
```

### 3. Ending Auction

```typescript
// Wait for auction to end
await ethers.provider.send('evm_increaseTime', [3600]);
await ethers.provider.send('evm_mine');

// End auction
await auction.endAuction();
```

### 4. Revealing Bids (Off-Chain)

```typescript
// Only after auction ends, decrypt bids
const aliceBid = await fhevm.decrypt(
  await auction.getAddress(),
  await auction.getBid(alice.address)
);

const bobBid = await fhevm.decrypt(await auction.getAddress(), await auction.getBid(bob.address));

console.log('Alice bid:', aliceBid); // 100
console.log('Bob bid:', bobBid); // 150
console.log('Winner: Bob');
```

## Key Features

### Privacy During Bidding

```solidity
// Bids are encrypted - no one can see them!
mapping(address => euint32) private bids;
```

Even the contract owner can't see bid amounts until decryption.

### Time-Based Logic

```solidity
require(block.timestamp < auctionEndTime, "Auction ended");
```

Ensures bids can only be placed during the bidding period.

### Sealed-Bid Mechanism

Bids remain encrypted until the auction ends, preventing:

- Bid sniping
- Strategic bidding based on others' bids
- Collusion

## Advanced Patterns

### Finding Highest Bid (On-Chain)

```solidity
euint32 private highestBid;
address public highestBidder;

function bid(externalEuint32 inputBid, bytes calldata inputProof) public {
    euint32 bidAmount = FHE.fromExternal(inputBid, inputProof);
    bids[msg.sender] = bidAmount;

    // Compare with current highest
    ebool isHigher = FHE.gt(bidAmount, highestBid);
    highestBid = FHE.select(isHigher, bidAmount, highestBid);

    // Update highest bidder (requires decryption)
    if (FHE.decrypt(isHigher)) {
        highestBidder = msg.sender;
    }

    FHE.allowThis(bidAmount);
    FHE.allow(bidAmount, msg.sender);
}
```

### Refund Mechanism

```solidity
function withdraw() public {
    require(ended, "Auction not ended");
    require(msg.sender != highestBidder, "Winner cannot withdraw");

    // Refund non-winners (implementation depends on payment mechanism)
}
```

## Security Considerations

### Prevent Bid Manipulation

```solidity
// ✅ Validate all inputs with proofs
euint32 bidAmount = FHE.fromExternal(inputBid, inputProof);
```

### Prevent Early Ending

```solidity
// ✅ Check time before ending
require(block.timestamp >= auctionEndTime, "Auction not yet ended");
```

### Prevent Double Ending

```solidity
// ✅ Check ended flag
require(!ended, "Auction already ended");
ended = true;
```

## Use Cases

- **NFT Auctions** - Sealed-bid NFT sales
- **Government Contracts** - Transparent procurement
- **Real Estate** - Private property bidding
- **Spectrum Auctions** - Telecom frequency allocation

## Limitations

### Winner Determination

Finding the winner on-chain requires:

1. Comparing all bids (expensive)
2. Or decrypting bids (reveals amounts)

**Solution:** Determine winner off-chain after auction ends.

### Payment Integration

This example doesn't include payment. In production:

- Lock funds when bidding
- Refund losers
- Transfer to winner

## Testing

```typescript
describe('BlindAuction', function () {
  it('Should accept bids during auction', async function () {
    const auction = await deploy(beneficiary, 3600);

    const input = await fhevm.createEncryptedInput(await auction.getAddress(), bidder.address);
    input.add32(100);
    const encrypted = await input.encrypt();

    await expect(auction.connect(bidder).bid(encrypted.handles[0], encrypted.inputProof)).to.emit(
      auction,
      'BidPlaced'
    );
  });

  it('Should reject bids after auction ends', async function () {
    const auction = await deploy(beneficiary, 3600);

    // Fast forward time
    await ethers.provider.send('evm_increaseTime', [3600]);
    await ethers.provider.send('evm_mine');

    const input = await fhevm.createEncryptedInput(await auction.getAddress(), bidder.address);
    input.add32(100);
    const encrypted = await input.encrypt();

    await expect(
      auction.connect(bidder).bid(encrypted.handles[0], encrypted.inputProof)
    ).to.be.revertedWith('Auction ended');
  });
});
```

## Next Steps

- [Confidential ERC20](confidential-erc20.md) - Token standard
- [Best Practices](../best-practices/security.md) - Security patterns
