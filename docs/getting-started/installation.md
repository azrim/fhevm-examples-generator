# Installation

## Prerequisites

- Node.js >= 20
- npm >= 9
- Git

## Clone an Example

Each example is a standalone Hardhat project:

```bash
# Clone the example you want
git clone <example-repo-url>
cd example-name

# Install dependencies
npm ci

# Verify installation
npm run compile
```

## Project Structure

```
example-name/
├── contracts/          # Solidity contracts
├── test/              # Test files
├── deploy/            # Deployment scripts
├── hardhat.config.ts  # Hardhat configuration
└── package.json       # Dependencies
```

## Dependencies

All examples use:

- **@fhevm/solidity** (v0.9.1) - Core FHEVM library
- **@fhevm/hardhat-plugin** (v0.3.0-1) - Testing integration
- **hardhat** - Development environment
- **ethers** - Ethereum library

## Next Steps

- [Your First Contract](first-contract.md) - Write your first FHE contract
- [Understanding FHE](understanding-fhe.md) - Learn FHE concepts
