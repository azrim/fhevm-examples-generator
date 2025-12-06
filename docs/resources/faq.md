# Frequently Asked Questions

## General

### What is FHEVM?

FHEVM (Fully Homomorphic Encryption Virtual Machine) is a technology that allows smart contracts to perform computations on encrypted data without decrypting it.

### Why use FHEVM?

- **Privacy**: Keep sensitive data encrypted on-chain
- **Compliance**: Meet regulatory requirements
- **Security**: Protect user information
- **Innovation**: Build new types of applications (private DeFi, confidential voting, etc.)

### Is FHEVM production-ready?

FHEVM is actively developed by Zama. Check the [official documentation](https://docs.zama.ai/fhevm) for the latest status.

## Development

### How do I get started?

1. Clone an example repository
2. Run `npm ci` to install dependencies
3. Run `npm test` to see it work
4. Modify the contract and experiment!

### What tools do I need?

- Node.js >= 20
- npm >= 9
- Hardhat (included in examples)
- Basic Solidity knowledge

### Can I use existing Solidity contracts?

Not directly. You need to:
1. Replace regular types with encrypted types (`uint32` → `euint32`)
2. Use FHE operations (`+` → `FHE.add()`)
3. Manage permissions (`FHE.allow()`)

## Technical

### What operations are supported?

**Arithmetic**: add, sub, mul
**Comparison**: eq, ne, lt, le, gt, ge
**Logical**: and, or, not
**Selection**: select (conditional)

### What operations are NOT supported?

- Division
- Modulo
- Exponentiation
- Bitwise operations (limited)

### Why are FHE operations expensive?

FHE operations involve complex cryptographic computations. They're 10-100x more expensive than regular operations.

### How can I reduce gas costs?

1. Use smaller types (`euint8` vs `euint64`)
2. Minimize FHE operations
3. Batch operations when possible
4. Cache results instead of recomputing

## Permissions

### Why do I need FHE.allowThis()?

The contract needs permission to access encrypted values it stores. Without it, the contract can't read its own encrypted state!

### Why do I need FHE.allow()?

Users need permission to decrypt values. Without it, they can't see the encrypted data even if they should have access.

### What's the difference between allow and allowTransient?

- `FHE.allow()`: Permanent permission (stored on-chain)
- `FHE.allowTransient()`: Temporary permission (not stored)

Use `allowTransient()` for intermediate values that don't need persistent access.

## Testing

### How do I test FHE contracts?

Examples include test files showing:
1. How to create encrypted inputs
2. How to call contract functions
3. How to decrypt and verify results

### Do I need a special testnet?

No! Tests run locally with Hardhat. For deployment, check Zama's documentation for available networks.

### Why do my tests fail?

Common issues:
- Missing `FHE.allowThis()`
- Missing `FHE.allow()`
- Wrong signer for encrypted input
- Incorrect input proof

## Errors

### "Insufficient balance" error

You forgot `FHE.allowThis()` or `FHE.allow()`.

### "Invalid proof" error

The encrypted input proof doesn't match the signer or contract address.

### "Cannot find name 'FHE'" error

Missing import:
```solidity
import {FHE, euint32} from "@fhevm/solidity/lib/FHE.sol";
```

## Resources

### Where can I learn more?

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Discord Community](https://discord.com/invite/zama)

### Where can I get help?

- [Zama Discord](https://discord.com/invite/zama)
- [GitHub Issues](https://github.com/zama-ai/fhevm/issues)
- [Documentation](https://docs.zama.ai/fhevm)

### How can I contribute?

- Try the examples
- Report bugs
- Suggest improvements
- Share your projects!
