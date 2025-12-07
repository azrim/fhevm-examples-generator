# Public Decrypt Multiple Values

Learn how to decrypt multiple encrypted values on-chain for public visibility.

## Overview

This example demonstrates batch on-chain public decryption using `FHE.decrypt()`. All decrypted values become publicly visible on the blockchain.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PublicDecryptMultiple is ZamaEthereumConfig {
    euint8 private encValue8;
    euint16 private encValue16;
    euint32 private encValue32;

    uint8 public decValue8;
    uint16 public decValue16;
    uint32 public decValue32;

    function storeMultiple(
        externalEuint8 inputEuint8,
        externalEuint16 inputEuint16,
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external {
        encValue8 = FHE.fromExternal(inputEuint8, inputProof);
        encValue16 = FHE.fromExternal(inputEuint16, inputProof);
        encValue32 = FHE.fromExternal(inputEuint32, inputProof);

        FHE.allowThis(encValue8);
        FHE.allowThis(encValue16);
        FHE.allowThis(encValue32);
    }

    function revealAll() external {
        decValue8 = FHE.decrypt(encValue8);
        decValue16 = FHE.decrypt(encValue16);
        decValue32 = FHE.decrypt(encValue32);
    }

    function getDecryptedValues() external view returns (uint8, uint16, uint32) {
        return (decValue8, decValue16, decValue32);
    }
}
```

## Key Concepts

### Batch Decryption

Decrypt multiple values in one transaction:

```solidity
decValue8 = FHE.decrypt(encValue8);
decValue16 = FHE.decrypt(encValue16);
decValue32 = FHE.decrypt(encValue32);
```

### Public Storage

All decrypted values are publicly accessible:

```solidity
uint8 public decValue8;
uint16 public decValue16;
uint32 public decValue32;
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

// Reveal all values on-chain
await contract.revealAll();

// Read all public decrypted values
const [dec8, dec16, dec32] = await contract.getDecryptedValues();
expect(dec8).to.equal(42);
expect(dec16).to.equal(1000);
expect(dec32).to.equal(100000);
```

## Use Cases

- Revealing multiple auction parameters
- Publishing aggregated statistics
- Finalizing multi-party computations
- Batch result publication

## Gas Optimization

Batch decryption is more efficient than multiple transactions:

```solidity
// ✅ Good: Batch decryption
function revealAll() external {
    decValue8 = FHE.decrypt(encValue8);
    decValue16 = FHE.decrypt(encValue16);
    decValue32 = FHE.decrypt(encValue32);
}

// ❌ Bad: Separate transactions
function reveal8() external { decValue8 = FHE.decrypt(encValue8); }
function reveal16() external { decValue16 = FHE.decrypt(encValue16); }
function reveal32() external { decValue32 = FHE.decrypt(encValue32); }
```

## Security Considerations

- Add access control to prevent unauthorized reveals
- Consider time-locks for delayed reveals
- Emit events for transparency
- Document the reveal conditions

## Example with Access Control

```solidity
address public owner;

modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

function revealAll() external onlyOwner {
    decValue8 = FHE.decrypt(encValue8);
    decValue16 = FHE.decrypt(encValue16);
    decValue32 = FHE.decrypt(encValue32);
    emit ValuesRevealed(decValue8, decValue16, decValue32);
}
```

## Next Steps

- [Blind Auction](blind-auction.md) - Practical reveal mechanism
- [Access Control](access-control.md) - Protect reveal functions
