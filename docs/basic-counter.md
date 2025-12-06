# Basic Counter Test Suite

This example demonstrates a simple encrypted counter using FHEVM, showing how to store and increment encrypted values

## Getting Started with FHEVM

### Contract Compilation

> **Note:** Verifies that the BasicCounter contract compiles successfully

## Deployment

### Deploy Counter Contract

> **Note:** Tests deployment and initialization of the encrypted counter

## Counter Operations

### Increment Counter

### Get Counter Value

### Increment by Custom Amount

> **Note:** Demonstrates incrementing the encrypted counter by 1

> **Note:** Shows how to retrieve the encrypted counter value

> **Note:** Demonstrates incrementing by an encrypted amount using input proofs

## Testing Patterns

### Call Increment Function

> **Note:** Tests that increment can be called without errors

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

This example demonstrates a simple encrypted counter using FHEVM, showing how to store and increment encrypted values

This example demonstrates:

- **Getting Started with FHEVM**: Contract Compilation
- **Deployment**: Deploy Counter Contract
- **Counter Operations**: Increment Counter, Get Counter Value, Increment by Custom Amount
- **Testing Patterns**: Call Increment Function

## Additional Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
