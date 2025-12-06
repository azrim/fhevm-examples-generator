# Arithmetic Operations

Perform encrypted arithmetic operations (add, subtract, multiply) on encrypted values.

## Overview

**Difficulty:** Beginner
**Concepts:** FHE arithmetic, encrypted operations

## What You'll Learn

- Encrypted addition
- Encrypted subtraction
- Encrypted multiplication
- Storing encrypted results

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract Arithmetic is ZamaEthereumConfig {
    euint32 private result;

    function add(externalEuint32 a, externalEuint32 b, bytes calldata proofA, bytes calldata proofB) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);

        result = FHE.add(valueA, valueB);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
    }

    function subtract(externalEuint32 a, externalEuint32 b, bytes calldata proofA, bytes calldata proofB) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);

        result = FHE.sub(valueA, valueB);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
    }

    function multiply(externalEuint32 a, externalEuint32 b, bytes calldata proofA, bytes calldata proofB) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);

        result = FHE.mul(valueA, valueB);

        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
    }

    function getResult() external view returns (euint32) {
        return result;
    }
}
```

## Operations

### Addition

```solidity
result = FHE.add(valueA, valueB);
```

Adds two encrypted values without decryption.

### Subtraction

```solidity
result = FHE.sub(valueA, valueB);
```

Subtracts encrypted values. Note: Result wraps around on underflow.

### Multiplication

```solidity
result = FHE.mul(valueA, valueB);
```

Multiplies encrypted values. More expensive than addition!

## Usage Example

```typescript
// Create encrypted inputs
const input = await fhevm.createEncryptedInput(contractAddr, signer.address);
input.add32(10);
input.add32(20);
const encrypted = await input.encrypt();

// Add: 10 + 20 = 30
await arithmetic.add(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.inputProof,
  encrypted.inputProof
);

// Get result
const encryptedResult = await arithmetic.getResult();
const result = await fhevm.decrypt(contractAddr, encryptedResult);
console.log(result); // 30
```

## Gas Costs

| Operation | Approximate Gas |
|-----------|----------------|
| `FHE.add()` | ~50,000 |
| `FHE.sub()` | ~50,000 |
| `FHE.mul()` | ~150,000 |

Multiplication is 3x more expensive than addition!

## Next Steps

- [Equality & Comparisons](equality.md) - Compare encrypted values
- [Encrypt Single Value](encrypt-single-value.md) - Input proofs explained
