# Basic Counter

A simple encrypted counter demonstrating fundamental FHEVM concepts.

## Overview

**Difficulty:** Beginner
**Concepts:** Encrypted state, basic operations, permissions

## What You'll Learn

- Store encrypted values
- Perform encrypted arithmetic
- Manage permissions
- Test FHE contracts

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract BasicCounter is ZamaEthereumConfig {
    euint32 private _count;

    function getCount() external view returns (euint32) {
        return _count;
    }

    function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);
        _count = FHE.add(_count, encryptedValue);

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }

    function decrement(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);
        _count = FHE.sub(_count, encryptedValue);

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }
}
```

## Key Features

### Encrypted State
```solidity
euint32 private _count;
```
The counter value is always encrypted - no one can see the actual count!

### Input Validation
```solidity
euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);
```
Input proofs ensure the encrypted value is correctly bound to the contract and user.

### FHE Operations
```solidity
_count = FHE.add(_count, encryptedValue);
```
Addition happens on encrypted values without decryption.

### Permission Management
```solidity
FHE.allowThis(_count);           // Contract can access
FHE.allow(_count, msg.sender);   // User can access
```
Both permissions are required for proper functionality.

## Usage

```typescript
// Deploy
const Counter = await ethers.getContractFactory('BasicCounter');
const counter = await Counter.deploy();

// Create encrypted input
const fhevm = await getFHEVM();
const input = await fhevm.createEncryptedInput(
  await counter.getAddress(),
  signer.address
);
input.add32(5);
const encrypted = await input.encrypt();

// Increment by 5
await counter.increment(encrypted.handles[0], encrypted.inputProof);

// Get encrypted count
const encryptedCount = await counter.getCount();

// Decrypt (requires permission)
const count = await fhevm.decrypt(await counter.getAddress(), encryptedCount);
console.log(count); // 5
```

## Testing

```bash
npm test
```

## Common Pitfalls

### ❌ Forgetting allowThis
```solidity
FHE.allow(_count, msg.sender);  // Missing allowThis!
```

### ✅ Correct Pattern
```solidity
FHE.allowThis(_count);
FHE.allow(_count, msg.sender);
```

### ❌ Wrong Signer
```typescript
// Alice creates input
const input = await fhevm.createEncryptedInput(contractAddr, alice.address);

// Bob tries to use it - FAILS!
await contract.connect(bob).increment(input.handles[0], input.inputProof);
```

### ✅ Correct Pattern
```typescript
// Alice creates and uses her own input
const input = await fhevm.createEncryptedInput(contractAddr, alice.address);
await contract.connect(alice).increment(input.handles[0], input.inputProof);
```

## Next Steps

- [Arithmetic Operations](arithmetic.md) - More FHE operations
- [Access Control](access-control.md) - Advanced permission patterns
