# FHEVM Examples Hub

A comprehensive collection of Fully Homomorphic Encryption (FHE) smart contract examples using Zama's FHEVM.

## What is FHEVM?

FHEVM enables smart contracts to perform computations on encrypted data without ever decrypting it. This revolutionary technology allows for:

- **Private Transactions** - Keep amounts and balances confidential
- **Confidential Voting** - Vote without revealing your choice
- **Sealed-Bid Auctions** - Bid without exposing your offer
- **Private DeFi** - Trade and lend with encrypted balances

## Quick Start

```bash
# Clone an example repository
git clone <example-repo-url>
cd example-name

# Install dependencies
npm ci

# Run tests
npm test
```

## Examples Overview

This hub contains 8 production-ready examples covering fundamental to advanced FHEVM concepts:

| Example | Difficulty | Concepts |
|---------|-----------|----------|
| Basic Counter | Beginner | Encrypted state, basic operations |
| Arithmetic | Beginner | Add, subtract, multiply on encrypted values |
| Equality | Beginner | Comparisons and conditional selection |
| Encrypt Single Value | Intermediate | Input proofs, encryption binding |
| Access Control | Intermediate | Permission management (allow, allowThis) |
| Input Proofs | Intermediate | Zero-knowledge proofs, validation |
| Blind Auction | Advanced | Sealed-bid auction, encrypted bids |
| Confidential ERC20 | Advanced | ERC-7984 token standard |

## Key Concepts

### Encrypted Types

```solidity
euint8, euint16, euint32, euint64  // Encrypted unsigned integers
ebool                               // Encrypted boolean
```

### FHE Operations

```solidity
FHE.add(a, b)      // Addition
FHE.sub(a, b)      // Subtraction
FHE.mul(a, b)      // Multiplication
FHE.eq(a, b)       // Equality
FHE.lt(a, b)       // Less than
FHE.select(cond, a, b)  // Conditional selection
```

### Permission System

```solidity
FHE.allowThis(value)           // Grant contract access
FHE.allow(value, address)      // Grant user access
FHE.allowTransient(value, address)  // Temporary access
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Generator Repository](https://github.com/azrim/fhevm-examples-generator)
- [Discord Community](https://discord.com/invite/zama)
