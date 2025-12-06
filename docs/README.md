# FHEVM Examples Hub

Welcome to the FHEVM Examples Hub! This collection provides comprehensive examples demonstrating Fully Homomorphic Encryption (FHE) smart contracts using Zama's FHEVM.

## What is FHEVM?

FHEVM (Fully Homomorphic Encryption Virtual Machine) enables smart contracts to perform computations on encrypted data without decrypting it. This allows for:

- **Private transactions** - Keep amounts and balances confidential
- **Confidential voting** - Vote without revealing your choice
- **Sealed-bid auctions** - Bid without exposing your offer
- **Private DeFi** - Trade and lend with encrypted balances

## Getting Started

Each example is a standalone Hardhat project that you can clone and run independently. All examples are based on the official [Zama FHEVM Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template).

### Quick Start

```bash
# Clone an example
git clone <example-repo-url>
cd <example-name>

# Install dependencies
npm ci

# Run tests
npm test

# Compile contracts
npx hardhat compile
```

## Examples by Category

### Getting Started
- [Basic Counter](basic-counter.md) - Simple encrypted counter demonstrating FHE basics

### Operations
- [Arithmetic](arithmetic.md) - Add, subtract, and multiply encrypted values

### Comparisons
- [Equality](equality.md) - Compare encrypted values and conditional selection

### Encryption
- [Encrypt Single Value](encrypt-single-value.md) - Single value encryption with input proofs

### Permissions
- [Access Control](access-control.md) - Managing permissions for encrypted data

### Security
- [Input Proofs](input-proofs.md) - Input proof validation and best practices

### Advanced
- [Blind Auction](blind-auction.md) - Sealed-bid auction with encrypted bids

### Tokens
- [OpenZeppelin ERC-7984](openzeppelin-erc7984.md) - Confidential ERC20 token implementation

## Key Concepts

### Encrypted Types

FHEVM provides encrypted integer types:
- `euint8`, `euint16`, `euint32`, `euint64` - Encrypted unsigned integers
- `ebool` - Encrypted boolean

### FHE Operations

Perform operations on encrypted data:
- **Arithmetic**: `FHE.add()`, `FHE.sub()`, `FHE.mul()`
- **Comparison**: `FHE.eq()`, `FHE.ne()`, `FHE.lt()`, `FHE.gt()`
- **Logical**: `FHE.and()`, `FHE.or()`, `FHE.not()`
- **Selection**: `FHE.select()` - Conditional selection

### Permission System

Control access to encrypted data:
- `FHE.allowThis()` - Grant contract access
- `FHE.allow()` - Grant user access
- `FHE.allowTransient()` - Temporary access

### Input Proofs

Validate encrypted inputs:
- `FHE.fromExternal()` - Convert external encrypted input with proof
- Zero-knowledge proofs ensure correct encryption binding

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [FHEVM Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama Discord](https://discord.com/invite/zama)

## Contributing

Found an issue or want to add an example? Visit the [FHEVM Examples Generator](https://github.com/azrim/fhevm-examples-generator) repository.

## License

All examples are licensed under BSD-3-Clause-Clear, following the Zama FHEVM template license.
