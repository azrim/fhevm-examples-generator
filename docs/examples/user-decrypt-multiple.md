# User Decrypt Multiple Values

Learn how to decrypt multiple encrypted values on the user side.

## Overview

This example demonstrates batch user-side decryption where the user can decrypt multiple encrypted values at once using their private key.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract UserDecryptMultiple is ZamaEthereumConfig {
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

    function getValues() external view returns (euint8, euint16, euint32) {
        return (value8, value16, value32);
    }
}
```

## Key Concepts

### Batch Permission Grant

Each value needs permission:

```solidity
FHE.allow(value8, msg.sender);
FHE.allow(value16, msg.sender);
FHE.allow(value32, msg.sender);
```

### Batch Decryption

Decrypt multiple values efficiently:

```typescript
const [enc8, enc16, enc32] = await contract.getValues();
const [dec8, dec16, dec32] = await Promise.all([
  fhevm.decrypt(enc8, userAddress),
  fhevm.decrypt(enc16, userAddress),
  fhevm.decrypt(enc32, userAddress),
]);
```

## Testing

```typescript
// Store multiple encrypted values
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

// Decrypt all values
const [enc8, enc16, enc32] = await contract.getValues();
const [dec8, dec16, dec32] = await Promise.all([
  fhevm.decrypt(enc8, signerAddress),
  fhevm.decrypt(enc16, signerAddress),
  fhevm.decrypt(enc32, signerAddress),
]);

expect(dec8).to.equal(42);
expect(dec16).to.equal(1000);
expect(dec32).to.equal(100000);
```

## Use Cases

- Retrieving multiple private balances
- Batch data queries
- Dashboard data for encrypted applications

## Performance Tips

- Use `Promise.all()` for parallel decryption
- Minimize the number of contract calls
- Cache decrypted values when appropriate

## Next Steps

- [Public Decrypt Multiple](public-decrypt-multiple.md) - On-chain batch decryption
- [Access Control](access-control.md) - Advanced permission management
