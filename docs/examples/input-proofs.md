# Input Proofs

Deep dive into input proofs, validation, and security best practices.

## Overview

**Difficulty:** Intermediate
**Concepts:** Zero-knowledge proofs, input validation, security

## What You'll Learn

- What input proofs are
- Why they're critical for security
- How to generate and validate them
- Common security pitfalls

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract InputProofs is ZamaEthereumConfig {
    mapping(address => euint32) private values;

    function storeWithProof(externalEuint32 input, bytes calldata inputProof) external {
        // Validates:
        // 1. Encrypted value is well-formed
        // 2. Value is bound to this contract
        // 3. Value is bound to msg.sender
        euint32 value = FHE.fromExternal(input, inputProof);

        values[msg.sender] = value;
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);
    }

    function addWithProofs(
        externalEuint32 inputA,
        externalEuint32 inputB,
        bytes calldata proofA,
        bytes calldata proofB
    ) external {
        // Each input needs its own proof
        euint32 valueA = FHE.fromExternal(inputA, proofA);
        euint32 valueB = FHE.fromExternal(inputB, proofB);

        euint32 sum = FHE.add(valueA, valueB);
        values[msg.sender] = sum;

        FHE.allowThis(sum);
        FHE.allow(sum, msg.sender);
    }

    function getValue(address user) external view returns (euint32) {
        return values[user];
    }
}
```

## What Are Input Proofs?

Input proofs are **zero-knowledge proofs** that validate encrypted inputs without revealing the plaintext value.

### What They Prove

1. **Well-formed encryption** - The ciphertext is valid
2. **Contract binding** - Value is bound to the specific contract address
3. **User binding** - Value is bound to the specific user address

### Why They Matter

Without input proofs, attackers could:
- **Replay attacks** - Reuse encrypted values from other transactions
- **Cross-contract att* - Use values from other contracts
- **Impersonation** - Use values encrypted for other users

## Generating Input Proofs

### Client-Side (TypeScript)

```typescript
import { getFHEVM } from './fhevm';

// Get contract and user addresses
const contractAddr = await contract.getAddress();
const userAddr = await signer.getAddress();

// Create encrypted input
const fhevm = await getFHEVM();
const input = await fhevm.createEncryptedInput(
  contractAddr,  // Binds to this contract
  userAddr       // Binds to this user
);

// Add values to encrypt
input.add32(42);
input.add32(100);

// Generate proof and encrypt
const encrypted = await input.encrypt();

// encrypted contains:
// - handles: array of encrypted values
// - inputProof: the zero-knowledge proof
```

### Using in Contract Call

```typescript
// Single value
await contract.storeWithProof(
  encrypted.handles[0],
  encrypted.inputProof
);

// Multiple values (same proof)
await contract.addWithProofs(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.inputProof,
  encrypted.inputProof  // Same proof for both
);
```

## Validation Process

### Contract-Side Validation

```solidity
function store(externalEuint32 input, bytes calldata inputProof) external {
    // FHE.fromExternal() validates:
    // 1. Proof is valid
    // 2. Input is bound to address(this)
    // 3. Input is bound to msg.sender
    euint32 value = FHE.fromExternal(input, inputProof);

    // If validation fails, transaction reverts
}
```

### What Gets Validated

```
Proof validates:
├── Ciphertext is well-formed
├── Contract address matches
├── User address matches
└── Cryptographic signature is valid
```

## Security Patterns

### ✅ Always Validate with Proof

```solidity
// Correct - validates input
function store(externalEuint32 input, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(input, proof);
    data[msg.sender] = value;
}
```

### ❌ Never Skip Validation

```solidity
// DANGEROUS - no validation!
function store(euint32 value) external {
    data[msg.sender] = value;  // Anyone can pass any encrypted value!
}
```

### ✅ One Proof Per Input Batch

```typescript
// Correct - one proof for multiple values
const input = await fhevm.createEncryptedInput(contractAddr, userAddr);
input.add32(10);
input.add32(20);
input.add32(30);
const encrypted = await input.encrypt();

// All values use the same proof
await contract.process(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.inputProof  // One proof for all
);
```

### ❌ Don't Mix Proofs from Different Batches

```typescript
// Wrong - mixing proofs from different batches
const batch1 = await input1.encrypt();
const batch2 = await input2.encrypt();

// Don't do this!
await contract.process(
  batch1.handles[0],
  batch2.handles[0],  // Different batch!
  batch1.inputProof
);
```

## Common Attacks Prevented

### Replay Attack

```typescript
// Attacker tries to reuse Alice's encrypted value
const aliceInput = await fhevm.createEncryptedInput(contract, alice.address);
aliceInput.add32(1000);
const aliceEncrypted = await aliceInput.encrypt();

// ❌ Bob tries to use Alice's input - FAILS!
await contract.connect(bob).store(
  aliceEncrypted.handles[0],
  aliceEncrypted.inputProof  // Bound to Alice, not Bob!
);
```

### Cross-Contract Attack

```typescript
// Attacker tries to use value from Contract A in Contract B
const inputA = await fhevm.createEncryptedInput(contractA.address, user);
inputA.add32(1000);
const encrypted = await inputA.encrypt();

// ❌ Try to use in Contract B - FAILS!
await contractB.store(
  encrypted.handles[0],
  encrypted.inputProof  // Bound to Contract A!
);
```

## Best Practices

1. **Always use FHE.fromExternal()** - Never accept raw encrypted values
2. **Bind to correct addresses** - Use actual contract and user addresses
3. **One proof per batch** - Encrypt multiple values together
4. **Validate on every input** - No exceptions
5. **Test with different signers** - Ensure binding works

## Testing Input Proofs

```typescript
describe('Input Proof Validation', function () {
  it('Should reject wrong signer', async function () {
    const [alice, bob] = await ethers.getSigners();

    // Alice creates input
    const input = await fhevm.createEncryptedInput(
      await contract.getAddress(),
      alice.address
    );
    input.add32(42);
    const encrypted = await input.encrypt();

    // Bob tries to use it - should fail
    await expect(
      contract.connect(bob).store(
        encrypted.handles[0],
        encrypted.inputProof
      )
    ).to.be.reverted;
  });

  it('Should reject wrong contract', async function () {
    const [signer] = await ethers.getSigners();

    // Create input for contract A
    const input = await fhevm.createEncryptedInput(
      await contractA.getAddress(),
      signer.address
    );
    input.add32(42);
    const encrypted = await input.encrypt();

    // Try to use in contract B - should fail
    await expect(
      contractB.store(
        encrypted.handles[0],
        encrypted.inputProof
      )
    ).to.be.reverted;
  });
});
```

## Next Steps

- [Blind Auction](blind-auction.md) - Advanced example using input proofs
- [Security Guidelines](../best-practices/security.md) - More security patterns

