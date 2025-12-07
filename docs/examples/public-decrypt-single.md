# Public Decrypt Single Value

Learn how to mark a single encrypted value for public decryption.

## Overview

This example demonstrates the public decryption pattern in FHEVM using `FHE.makePubliclyDecryptable()`. This marks values for decryption by the Key Management System (KMS), making them publicly accessible off-chain.

## Contract

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PublicDecryptSingle is ZamaEthereumConfig {
    euint32 private encryptedScore;

    function setScore(externalEuint32 score, bytes calldata inputProof) public {
        euint32 encScore = FHE.fromExternal(score, inputProof);
        FHE.allowThis(encScore);
        encryptedScore = encScore;
    }

    function markForPublicDecryption() public {
        FHE.makePubliclyDecryptable(encryptedScore);
    }

    function isMarkedPublic() public view returns (bool) {
        return FHE.isPubliclyDecryptable(encryptedScore);
    }
}
```

## Key Concepts

### Marking for Decryption

Use `FHE.makePubliclyDecryptable()` to mark a value:

```solidity
FHE.makePubliclyDecryptable(encryptedScore);
```

### Checking Decryption Status

Check if a value is marked:

```solidity
bool isMarked = FHE.isPubliclyDecryptable(encryptedScore);
```

## How It Works

1. **Store encrypted value** - Value remains encrypted on-chain
2. **Mark for decryption** - Call `makePubliclyDecryptable()`
3. **KMS decrypts off-chain** - The Key Management System can now decrypt the value
4. **Result available publicly** - Decrypted value can be accessed off-chain

## Use Cases

- Revealing auction winners after bidding ends
- Publishing voting results after polls close
- Finalizing confidential computations
- Time-locked secret reveals

## Important Notes

- Decryption happens **off-chain** via the KMS
- Once marked, the value can be decrypted by anyone with KMS access
- This is **irreversible** - marked values remain decryptable
- Requires KMS infrastructure for actual decryption

## Next Steps

- [Public Decrypt Multiple](public-decrypt-multiple.md) - Mark multiple values
- [Blind Auction](blind-auction.md) - Practical reveal mechanism
