# Blind Auction Example

Demonstrates a sealed-bid auction where bids remain encrypted until the auction ends

## Advanced Examples

### Sealed-Bid Auction

This example shows how to build a blind auction where:

- Bidders submit encrypted bids that remain private
- The highest bid is tracked without revealing individual bids
- The auction can be ended to reveal the winner

> **Note:** This example requires FHE runtime for full functionality

## How to Run Tests

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Or compile only
npx hardhat compile
```

## What This Example Teaches

Demonstrates a sealed-bid auction where bids remain encrypted until the auction ends

This example demonstrates:

- **Advanced Examples**: Sealed-Bid Auction
  This example shows how to build a blind auction where:
- Bidders submit encrypted bids that remain private
- The highest bid is tracked without revealing individual bids
- The auction can be ended to reveal the winner

## Additional Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
