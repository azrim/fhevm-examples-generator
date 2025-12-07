# Encrypt Multiple Values

Learn how to encrypt multiple values of different types in a single transaction.

## Overview

This example demonstrates batch encryption of multiple encrypted values (euint8, euint16, euint32) using input proofs. This is more efficient than encrypting values one at a time.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptMultipleValues is ZamaEthereumConfig {
    euint8 private value8;
    euint16 private value16;
    euint32 private value32;

    function storeMultiple(
        externalEuint8 inputEuint8,
        externalEuint16 inputEuint16,
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external {
        value8 = FHE.fromExternal(inputEuint8, inputProof);
        value16 = FHE.fromExternal(inputEuint16, inputProof);
        value32 = FHE.fromExternal(inputEuint32, inputProof);

        FHE.allowThis(value8);
        FHE.allowThis(value16);
        FHE.allowThis(value32);
        FHE.allow(value8, msg.sender);
        FHE.allow(value16, msg.sender);
        FHE.allow(value32, msg.sender);
    }
}
```

## Key Concepts

### Batch Encryption

All values share the same input proof, making the operation more efficient:

```solidity
value8 = FHE.fromExternal(inputEuint8, inputProof);
value16 = FHE.fromExternal(inputEuint16, inputProof);
value32 = FHE.fromExternal(inputEuint32, inputProof);
```

### Permission Management

Each encrypted value needs its own permissions:

```solidity
FHE.allowThis(value8);
FHE.allow(value8, msg.sender);
```

## Testing

```typescript
const input = await fhevm.createEncryptedInput(contractAddress, signerAddress);
input.add8(42);
input.add16(1000);
input.add32(100000);
const encryptedInput = await input.encrypt();

await contract.storeMultiple(
  encryptedInput.handles[0],
  encryptedInput.handles[1],
  encryptedInput.handles[2],
  encryptedInput.inputProof
);
```

## Use Cases

- Storing multiple encrypted parameters in one transaction
- Batch updates to encrypted state
- Efficient initialization of encrypted data structures

## Next Steps

- [User Decrypt Multiple](user-decrypt-multiple.md) - Decrypt multiple values
- [Access Control](access-control.md) - Advanced permission patterns
