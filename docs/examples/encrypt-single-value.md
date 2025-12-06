# Encrypt Single Value

Learn how to properly encrypt and validate single values with input proofs.

## Overview

**Difficulty:** Intermediate
Concepts:\*\* Input proofs, encryption binding, validation

## What You'll Learn

- How input proofs work
- Encryption binding to contract and user
- Proper validation patterns
- Common mistakes to avoid

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptSingleValue is ZamaEthereumConfig {
    mapping(address => euint32) private values;

    function storeEncryptedValue(externalEuint32 input, bytes calldata inputProof) external {
        // Convert external input with proof validation
        euint32 value = FHE.fromExternal(input, inputProof);

        // Store the encrypted value
        values[msg.sender] = value;

        // Grant permissions
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);
    }

    function getEncryptedValue(address user) external view returns (euint32) {
        return values[user];
    }

    function addToValue(externalEuint32 input, bytes calldata inputProof) external {
        euint32 addValue = FHE.fromExternal(input, inputProof);
        values[msg.sender] = FHE.add(values[msg.sender], addValue);

        FHE.allowThis(values[msg.sender]);
        FHE.allow(values[msg.sender], msg.sender);
    }
}
```

## Input Proofs Explained

### What is an Input Proof?

An input proof is a zero-knowledge proof that validates:

1. The encrypted value is correctly formed
2. The value is bound to the specific contract address
3. The value is bound to the specific user address

### Why Are They Needed?

Without input proofs, attackers could:

- Replay encrypted values from other contracts
- Use encrypted values from other users
- Submit malformed encrypted data

### How to Create Input Proofs

```typescript
// Create encrypted input with proof
const fhevm = await getFHEVM();
const input = await fhevm.createEncryptedInput(
  contractAddress, // Binds to this contract
  userAddress // Binds to this user
);

// Add the value to encrypt
input.add32(42);

// Generate proof and encrypt
const encrypted = await input.encrypt();

// Use in contract call
await contract.storeEncryptedValue(
  encrypted.handles[0], // The encrypted value
  encrypted.inputProof // The proof
);
```

## Encryption Binding

### Contract Binding

```typescript
// ✅ Correct - bound to contract A
const input = await fhevm.createEncryptedInput(contractA.address, user.address);
await contractA.store(input.handles[0], input.inputProof);

// ❌ Wrong - bound to contract A, used in contract B
await contractB.store(input.handles[0], input.inputProof); // FAILS!
```

### User Binding

```typescript
// ✅ Correct - Alice creates and uses her own input
const input = await fhevm.createEncryptedInput(contract.address, alice.address);
await contract.connect(alice).store(input.handles[0], input.inputProof);

// ❌ Wrong - Alice creates, Bob tries to use
const input = await fhevm.createEncryptedInput(contract.address, alice.address);
await contract.connect(bob).store(input.handles[0], input.inputProof); // FAILS!
```

## Common Mistakes

### ❌ Missing Input Proof

```solidity
// Wrong - no proof validation
function store(euint32 value) external {
    values[msg.sender] = value;
}
```

### ✅ Correct Pattern

```solidity
// Correct - validates with proof
function store(externalEuint32 input, bytes calldata inputProof) external {
    euint32 value = FHE.fromExternal(input, inputProof);
    values[msg.sender] = value;
}
```

### ❌ Wrong Address Binding

```typescript
// Wrong - using wrong contract address
const input = await fhevm.createEncryptedInput(
  wrongAddress, // ❌ Wrong contract
  user.address
);
```

### ✅ Correct Address Binding

```typescript
// Correct - using actual contract address
const contractAddr = await contract.getAddress();
const input = await fhevm.createEncryptedInput(
  contractAddr, // ✅ Correct contract
  user.address
);
```

## Security Considerations

### Always Validate Proofs

```solidity
// ✅ Always use FHE.fromExternal() with proof
euint32 value = FHE.fromExternal(input, inputProof);
```

This ensures:

- Value is correctly encrypted
- Value is bound to this contract
- Value is bound to msg.sender

### Don't Skip Permissions

```solidity
// After storing encrypted value
FHE.allowThis(value);           // Contract needs access
FHE.allow(value, msg.sender);   // User needs access
```

## Testing

```typescript
describe('EncryptSingleValue', function () {
  it('Should store encrypted value with proof', async function () {
    const [signer] = await ethers.getSigners();
    const contract = await deployContract();

    // Create encrypted input with proof
    const fhevm = await getFHEVM();
    const input = await fhevm.createEncryptedInput(await contract.getAddress(), signer.address);
    input.add32(42);
    const encrypted = await input.encrypt();

    // Store with proof
    await contract.storeEncryptedValue(encrypted.handles[0], encrypted.inputProof);

    // Verify stored
    const stored = await contract.getEncryptedValue(signer.address);
    expect(stored).to.not.be.undefined;
  });
});
```

## Next Steps

- [Access Control](access-control.md) - Permission management
- [Input Proofs Concept](../concepts/input-proofs.md) - Deep dive
