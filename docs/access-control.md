# Access Control Test Suite

This example demonstrates access control patterns for encrypted data, including FHE.allow, FHE.allowThis, and FHE.allowTransient

## Access Control Patterns

### Contract Compilation

> **Note:** Verifies that the AccessControl contract compiles successfully

## Deployment

### Deploy Access Control Contract

> **Note:** Tests deployment and owner initialization

## Permission Management

### Set Balance with Permissions

### Get Balance

> **Note:** Demonstrates FHE.allowThis and FHE.allow for permanent permissions

> **Note:** Shows how authorized addresses can access encrypted balances

## Explicit Access Granting

### Grant Access to Another Address

> **Note:** Demonstrates explicit permission granting to third parties

## Transient Permissions

### Transfer with Transient Access

> **Note:** Demonstrates FHE.allowTransient for temporary computation access

## Access Verification

### Check Contract Access

> **Note:** Shows how to verify access permissions

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

This example demonstrates access control patterns for encrypted data, including FHE.allow, FHE.allowThis, and FHE.allowTransient

This example demonstrates:

- **Access Control Patterns**: Contract Compilation
- **Deployment**: Deploy Access Control Contract
- **Permission Management**: Set Balance with Permissions, Get Balance
- **Explicit Access Granting**: Grant Access to Another Address
- **Transient Permissions**: Transfer with Transient Access
- **Access Verification**: Check Contract Access

## Additional Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
