# Public Decrypt Multiple Values

Learn how to mark multiple encrypted values for public decryption in batch.

## Overview

This example demonstrates batch public decryption by marking multiple encrypted values at once using `FHE.makePubliclyDecryptable()`. This is more efficient than marking values individually.

## Contract

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PublicDecryptMultiple is ZamaEthereumConfig {
    euint8 private strength;
    euint16 private health;
    euint32 private experience;

    function markAllForPublicDecryption() public {
        FHE.makePubliclyDecryptable(strength);
        FHE.makePubliclyDecryptable(health);
        FHE.makePubliclyDecryptable(experience);
    }

    function areStatsMarkedPublic() public view returns (bool, bool, bool) {
        return (
            FHE.isPubliclyDecryptable(strength),
            FHE.isPubliclyDecryptable(health),
            FHE.isPubliclyDecryptable(experience)
        );
    }
}
```

## Key Concepts

### Batch Marking

Mark multiple values in one transaction:

```solidity
FHE.makePubliclyDecryptable(strength);
FHE.makePubliclyDecryptable(health);
FHE.makePubliclyDecryptable(experience);
```

### Batch Status Check

Check all values at once:

```solidity
(bool str, bool hp, bool exp) = areStatsMarkedPublic();
```

## Use Cases

- Revealing multiple auction parameters simultaneously
- Publishing aggregated statistics
- Finalizing multi-party computations
- Batch result publication

## Gas Optimization

Batch marking is more efficient than multiple transactions:

```solidity
// ✅ Good: Batch marking
function markAll() external {
    FHE.makePubliclyDecryptable(value1);
    FHE.makePubliclyDecryptable(value2);
    FHE.makePubliclyDecryptable(value3);
}

// ❌ Bad: Separate transactions
function mark1() external { FHE.makePubliclyDecryptable(value1); }
function mark2() external { FHE.makePubliclyDecryptable(value2); }
function mark3() external { FHE.makePubliclyDecryptable(value3); }
```

## Security Considerations

- Add access control to prevent unauthorized marking
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

function markAll() external onlyOwner {
    FHE.makePubliclyDecryptable(strength);
    FHE.makePubliclyDecryptable(health);
    FHE.makePubliclyDecryptable(experience);
    emit ValuesMarkedForDecryption();
}
```

## Next Steps

- [Blind Auction](blind-auction.md) - Practical reveal mechanism
- [Access Control](access-control.md) - Protect reveal functions
