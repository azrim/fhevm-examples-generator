# Input Proofs Test Suite

This example explains input proofs in FHEVM - why they're needed and how to use them correctly

## Understanding Input Proofs

### What Are Input Proofs

> **Note:** Input proofs are cryptographic proofs that validate encrypted inputs are properly formed and authorized

## Why Input Proofs Are Needed

### Security and Validation

> **Note:** Input proofs prevent malicious or malformed encrypted data from being processed

## Using Input Proofs Correctly

### Store Value With Proof

### Multiple Input Proofs

> **Note:** The storeWithProof function demonstrates proper input proof usage

> **Note:** When using multiple encrypted inputs, each needs its own proof

## Best Practices

### Always Validate Proofs

> **Note:** Never skip input proof validation in production code

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

This example explains input proofs in FHEVM - why they're needed and how to use them correctly

This example demonstrates:

- **Understanding Input Proofs**: What Are Input Proofs
- **Why Input Proofs Are Needed**: Security and Validation
- **Using Input Proofs Correctly**: Store Value With Proof, Multiple Input Proofs
- **Best Practices**: Always Validate Proofs

## Additional Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
