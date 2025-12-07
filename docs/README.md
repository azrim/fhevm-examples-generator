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

This hub contains 13 production-ready examples covering fundamental to advanced FHEVM concepts:

### Basic Operations (3)

| Example       | Concepts                                    |
| ------------- | ------------------------------------------- |
| Basic Counter | Encrypted state, increment/decrement        |
| Arithmetic    | Add, subtract, multiply on encrypted values |
| Equality      | Comparisons and conditional selection       |

### Encryption (2)

| Example                 | Concepts                              |
| ----------------------- | ------------------------------------- |
| Encrypt Single Value    | Input proofs, single value encryption |
| Encrypt Multiple Values | Batch encryption of multiple types    |

### User Decryption (2)

| Example               | Concepts                                |
| --------------------- | --------------------------------------- |
| User Decrypt Single   | User-side decryption of single value    |
| User Decrypt Multiple | User-side decryption of multiple values |

### Advanced (4)

| Example            | Concepts                                 |
| ------------------ | ---------------------------------------- |
| Access Control     | Permission management (allow, allowThis) |
| Input Proofs       | Zero-knowledge proofs, validation        |
| Blind Auction      | Sealed-bid auction, encrypted bids       |
| Confidential ERC20 | ERC-7984 token standard                  |

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
