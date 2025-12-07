# User Decrypt Single Value

Learn how to decrypt a single encrypted value on the user side.

## Overview

This example demonstrates user-side decryption where the user can decrypt their own encrypted values using their private key. The contract grants permission, and the user decrypts off-chain.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract UserDecryptSingle is ZamaEthereumConfig {
    euint32 private userValue;

    function storeValue(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        userValue = FHE.fromExternal(inputEuint32, inputProof);
        FHE.allowThis(userValue);
        FHE.allow(userValue, msg.sender);
    }

    function getValue() external view returns (euint32) {
        return userValue;
    }
}
```

## Key Concepts

### Permission for Decryption

The user must have permission to decrypt:

```solidity
FHE.allow(userValue, msg.sender);
```

### User-Side Decryption

Decryption happens off-chain using the FHEVM SDK:

```typescript
const encryptedValue = await contract.getValue();
const decryptedValue = await fhevm.decrypt(encryptedValue, userAddress);
```

## Testing

```typescript
// Store encrypted value
const input = await fhevm.createEncryptedInput(contractAddress, signerAddress);
input.add32(42);
const encryptedInput = await input.encrypt();
await contract.storeValue(encryptedInput.handles[0], encryptedInput.inputProof);

// Decrypt on user side
const encryptedValue = await contract.getValue();
const decryptedValue = await fhevm.decrypt(encryptedValue, signerAddress);
expect(decryptedValue).to.equal(42);
```

## Use Cases

- Private balance queries
- Personal data retrieval
- Confidential voting results (for the voter)

## Security Notes

- Only the user with permission can decrypt
- Decryption happens off-chain, not on-chain
- The contract never sees the decrypted value

## Next Steps

- [User Decrypt Multiple](user-decrypt-multiple.md) - Decrypt multiple values
- [Public Decrypt Single](public-decrypt-single.md) - On-chain decryption
