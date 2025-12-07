# Public Decrypt Single Value

Learn how to decrypt a single encrypted value on-chain for public visibility.

## Overview

This example demonstrates on-chain public decryption using `FHE.decrypt()`. The decrypted value becomes publicly visible on the blockchain.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PublicDecryptSingle is ZamaEthereumConfig {
    euint32 private encryptedValue;
    uint32 public decryptedValue;

    function storeEncrypted(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        encryptedValue = FHE.fromExternal(inputEuint32, inputProof);
        FHE.allowThis(encryptedValue);
    }

    function revealValue() external {
        decryptedValue = FHE.decrypt(encryptedValue);
    }

    function getDecryptedValue() external view returns (uint32) {
        return decryptedValue;
    }
}
```

## Key Concepts

### On-Chain Decryption

Use `FHE.decrypt()` to decrypt on-chain:

```solidity
decryptedValue = FHE.decrypt(encryptedValue);
```

### Public Visibility

Once decrypted, the value is publicly visible:

```solidity
uint32 public decryptedValue;
```

## Testing

```typescript
// Store encrypted value
const input = await fhevm.createEncryptedInput(contractAddress, signerAddress);
input.add32(42);
const encryptedInput = await input.encrypt();
await contract.storeEncrypted(encryptedInput.handles[0], encryptedInput.inputProof);

// Reveal the value on-chain
await contract.revealValue();

// Read the public decrypted value
const decrypted = await contract.getDecryptedValue();
expect(decrypted).to.equal(42);
```

## Use Cases

- Revealing auction winners
- Publishing voting results
- Finalizing confidential computations
- Time-locked secrets

## Security Considerations

- Only decrypt when necessary
- Consider access control for the reveal function
- Understand that decryption is irreversible
- Gas costs are higher for decryption

## When to Use

Use public decryption when:

- The value needs to be publicly known eventually
- You need to use the value in non-FHE operations
- You're implementing a reveal mechanism

Avoid public decryption when:

- The value should remain private
- User-side decryption is sufficient
- Gas costs are a concern

## Next Steps

- [Public Decrypt Multiple](public-decrypt-multiple.md) - Decrypt multiple values
- [Blind Auction](blind-auction.md) - Practical reveal mechanism
