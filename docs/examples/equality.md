# Equality & Comparisons

Compare encrypted values and perform conditional selection.

## Overview

**Difficulty:** Beginner
**Concepts:** Encrypted comparisons, conditional logic

## What You'll Learn

- Equality checks on encrypted values
- Inequality checks
- Conditional selection with `FHE.select()`

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract Equality is ZamaEthereumConfig {
    euint32 private lastResult;

    function isEqual(externalEuint32 a, externalEuint32 b, bytes calldata proofA, bytes calldata proofB) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);

        ebool equal = FHE.eq(valueA, valueB);
        lastResult = FHE.select(equal, FHE.asEuint32(1), FHE.asEuint32(0));

        FHE.allowThis(lastResult);
        FHE.allow(lastResult, msg.sender);
    }

    function isNotEqual(externalEuint32 a, externalEuint32 b, bytes calldata proofA, bytes calldata proofB) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);

        ebool notEqual = FHE.ne(valueA, valueB);
        lastResult = FHE.select(notEqual, FHE.asEuint32(1), FHE.asEuint32(0));

        FHE.allowThis(lastResult);
        FHE.allow(lastResult, msg.sender);
    }

    function selectValue(externalEuint32 a, externalEuint32 b, externalEuint32 condition, bytes calldata proofA, bytes calldata proofB, bytes calldata proofCond) external {
        euint32 valueA = FHE.fromExternal(a, proofA);
        euint32 valueB = FHE.fromExternal(b, proofB);
        euint32 condValue = FHE.fromExternal(condition, proofCond);

        ebool cond = FHE.eq(condValue, FHE.asEuint32(1));
        lastResult = FHE.select(cond, valueA, valueB);

        FHE.allowThis(lastResult);
        FHE.allow(lastResult, msg.sender);
    }

    function getLastResult() external view returns (euint32) {
        return lastResult;
    }
}
```

## Comparison Operations

### Equality

```solidity
ebool equal = FHE.eq(a, b);
```

Returns encrypted boolean: true if equal, false otherwise.

### Inequality

```solidity
ebool notEqual = FHE.ne(a, b);
```

Returns encrypted boolean: true if not equal.

### Other Comparisons

```solidity
ebool lessThan = FHE.lt(a, b);      // a < b
ebool lessOrEqual = FHE.le(a, b);   // a <= b
ebool greaterThan = FHE.gt(a, b);   // a > b
ebool greaterOrEqual = FHE.ge(a, b); // a >= b
```

## Conditional Selection

```solidity
euint32 result = FHE.select(condition, ifTrue, ifFalse);
```

Selects `ifTrue` if condition is true, otherwise `ifFalse`.

### Example: Max Function

```solidity
function max(euint32 a, euint32 b) internal pure returns (euint32) {
    ebool aGreater = FHE.gt(a, b);
    return FHE.select(aGreater, a, b);
}
```

## Important Notes

### ❌ Can't Use Regular Operators

```solidity
// ❌ WRONG - Won't compile
if (encryptedA == encryptedB) { }
if (encryptedA > encryptedB) { }
```

### ✅ Use FHE Functions

```solidity
// ✅ CORRECT
ebool equal = FHE.eq(encryptedA, encryptedB);
ebool greater = FHE.gt(encryptedA, encryptedB);
```

### ❌ Can't Branch on Encrypted Booleans

```solidity
ebool condition = FHE.eq(a, b);
// ❌ WRONG - Can't use encrypted bool in if statement
if (condition) { }
```

### ✅ Use FHE.select() Instead

```solidity
ebool condition = FHE.eq(a, b);
// ✅ CORRECT - Use select for conditional logic
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);
```

## Next Steps

- [Encrypt Single Value](encrypt-single-value.md) - Input proofs
- [Access Control](access-control.md) - Permission patterns
