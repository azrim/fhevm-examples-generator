# Your First FHE Contract

Let's build a simple encrypted counter to understand FHEVM basics.

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
}
```

## Key Components

### 1. Imports

```solidity
import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
```

- `FHE` - Core library for FHE operations
- `euint32` - Encrypted 32-bit unsigned integer
- `externalEuint32` - External encrypted input type

### 2. Encrypted State

```solidity
euint32 private _count;
```

The counter is stored as an encrypted value. No one can see its actual value!

### 3. FHE Operations

```solidity
_count = FHE.add(_count, encryptedValue);
```

Perform addition on encrypted values without decryption.

### 4. Permissions

```solidity
FHE.allowThis(_count);           // Contract can access
FHE.allow(_count, msg.sender);   // User can access
```

Grant access to encrypted values.

## Testing

```typescript
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('BasicCounter', function () {
  it('Should increment the counter', async function () {
    const Counter = await ethers.getContractFactory('BasicCounter');
    const counter = await Counter.deploy();

    // Create encrypted input
    const fhevm = await getFHEVM();
    const input = await fhevm.createEncryptedInput(await counter.getAddress(), signer.address);
    input.add32(5);
    const encryptedInput = await input.encrypt();

    // Increment
    await counter.increment(encryptedInput.handles[0], encryptedInput.inputProof);

    // Verify (in real scenario, you'd decrypt to verify)
    expect(await counter.getCount()).to.not.be.undefined;
  });
});
```

## Run It

```bash
# Compile
npm run compile

# Test
npm test
```

## Next Steps

- [Understanding FHE](understanding-fhe.md) - Deep dive into FHE concepts
- [Arithmetic Operations](../examples/arithmetic.md) - More FHE operations
