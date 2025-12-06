# Troubleshooting

Common issues and solutions when working with FHEVM contracts.

## Installation Issues

### Node Modules Installation Fails

**Problem**: `npm install` fails with dependency errors.

**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Python/Build Tools Missing

**Proem**: Installation fails with "Python not found" or "node-gyp" errors.

**Solution**:

**Windows**:

```bash
npm install --global windows-build-tools
```

**macOS**:

```bash
xcode-select --install
```

**Linux**:

```bash
sudo apt-get install build-essential python3
```

## Compilation Errors

### Import Not Found

**Problem**: `Error: Source "..." not found`

**Solution**: Ensure you're using correct import paths:

```solidity
// ✅ Correct
import "@fhevm/solidity/lib/FHE.sol";

// ❌ Wrong
import "fhevm/lib/TFHE.sol";
```

### Solidity Version Mismatch

**Problem**: `Error: Source file requires different compiler version`

**Solution**: Check your `hardhat.config.ts`:

```typescript
solidity: {
  version: "0.8.24", // Must match contract pragma
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
}
```

### Missing FHEVM Plugin

**Problem**: `FHE` library not recognized during compilation.

**Solution**: Ensure plugin is imported in `hardhat.config.ts`:

```typescript
import '@fhevm/hardhat-plugin';
```

## Runtime Errors

### Input Proof Verification Failed

**Problem**: Transaction reverts with "Invalid input proof" or similar error.

**Cause**: Mismatch between encryption signer and transaction signer.

**Solution**: Ensure the same signer creates input and sends transaction:

```typescript
// ✅ Correct
const input = instances.alice.createEncryptedInput(contractAddr, signers.alice.address);
input.add32(42);
const encInput = await input.encrypt();

await contract
  .connect(signers.alice) // Same signer
  .setValue(encInput.handles[0], encInput.inputProof);

// ❌ Wrong
const input = instances.alice.createEncryptedInput(contractAddr, signers.alice.address);
input.add32(42);
const encInput = await input.encrypt();

await contract
  .connect(signers.bob) // Different signer - will fail!
  .setValue(encInput.handles[0], encInput.inputProof);
```

### Decryption Permission Denied

**Problem**: Cannot decrypt encrypted value, transaction reverts or returns error.

**Cause**: Missing `FHE.allowThis()` or `FHE.allow()` calls.

**Solution**: Grant both contract and user permissions:

```solidity
// ✅ Correct - Grant both permissions
function setValue(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allowThis(encValue);        // Contract permission
    FHE.allow(encValue, msg.sender); // User permission
    values[msg.sender] = encValue;
}

// ❌ Wrong - Missing allowThis
function setValue(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allow(encValue, msg.sender); // Only user permission - will fail!
    values[msg.sender] = encValue;
}
```

### Handle is Zero or Invalid

**Problem**: Encrypted handle is 0 or operations fail with "Invalid handle".

**Cause**: Value not properly initialized or permissions not set.

**Solution**: Always initialize encrypted values and set permissions:

```solidity
// ✅ Correct
euint32 public counter;

constructor() {
    counter = FHE.asEuint32(0);
    FHE.allowThis(counter);
}

// ❌ Wrong - Not initialized
euint32 public counter; // Will be invalid handle
```

## Testing Issues

### Test Hangs or Times Out

**Problem**: Tests hang indefinitely or timeout.

**Cause**: Waiting for decryption that will never complete due to missing permissions.

**Solution**:

1. Check permissions are correctly set in contract
2. Add timeout to test:

```typescript
it('should decrypt value', async function () {
  this.timeout(10000); // 10 second timeout

  const handle = await contract.getValue();
  const value = await instances.alice.decrypt(contractAddress, handle);
  expect(value).to.equal(42);
});
```

### Instance Creation Fails

**Problem**: `createInstances()` throws error or returns undefined.

**Solution**: Ensure proper initialization:

```typescript
import { createInstances } from '../instance';
import { getSigners, initSigners } from '../signers';

describe('MyContract', function () {
  before(async function () {
    await initSigners(); // Must be called first
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const deployment = await deployFixture();
    this.contractAddress = await deployment.contract.getAddress();
    this.instances = await createInstances(this.contractAddress, ethers, this.signers);
  });
});
```

### Decryption Returns Undefined

**Problem**: `decrypt()` returns `undefined` instead of value.

**Cause**: User doesn't have permission to decrypt.

**Solution**: Verify permissions in contract:

```solidity
function getValue() public view returns (euint32) {
    return values[msg.sender]; // Returns value user has permission for
}

// In setter, ensure permission was granted:
function setValue(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allowThis(encValue);
    FHE.allow(encValue, msg.sender); // Critical!
    values[msg.sender] = encValue;
}
```

## Deployment Issues

### Deployment Fails on Network

**Problem**: Deployment transaction reverts or fails.

**Solution**: Check network configuration in `hardhat.config.ts`:

```typescript
networks: {
  zama: {
    url: "https://devnet.zama.ai",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 8009,
  },
}
```

Ensure `.env` file has valid private key:

```
PRIVATE_KEY=0x...
```

### Gas Estimation Failed

**Problem**: "Cannot estimate gas" error during deployment.

**Solution**: Manually set gas limit:

```typescript
const contract = await factory.deploy({
  gasLimit: 5000000,
});
```

## Performance Issues

### High Gas Costs

**Problem**: Transactions consume excessive gas.

**Solution**: Optimize encrypted operations:

```solidity
// ❌ Inefficient - Multiple operations
function inefficient(euint32 a, euint32 b, euint32 c) public {
    euint32 temp1 = FHE.add(a, b);
    FHE.allowThis(temp1);
    euint32 temp2 = FHE.add(temp1, c);
    FHE.allowThis(temp2);
    result = temp2;
}

// ✅ Better - Minimize intermediate values
function efficient(euint32 a, euint32 b, euint32 c) public {
    result = FHE.add(FHE.add(a, b), c);
    FHE.allowThis(result);
}
```

See [Gas Optimization](../best-practices/gas-optimization.md) for more tips.

### Slow Test Execution

**Problem**: Tests take very long to run.

**Solution**: Use fixtures and parallel execution:

```typescript
// Use fixtures for faster setup
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe('MyContract', function () {
  async function deployFixture() {
    // Setup code
    return { contract, signers };
  }

  it('test 1', async function () {
    const { contract } = await loadFixture(deployFixture);
    // Test code
  });
});
```

Run tests in parallel:

```bash
npx hardhat test --parallel
```

## Type Errors

### TypeScript Compilation Errors

**Problem**: TypeScript errors in test files.

**Solution**: Ensure proper types are imported:

```typescript
import type { Signers } from '../signers';
import type { FhevmInstance } from 'fhevmjs';

declare module 'mocha' {
  export interface Context {
    signers: Signers;
    instances: FhevmInstance;
    contractAddress: string;
  }
}
```

### Missing Type Definitions

**Problem**: "Cannot find module" for type imports.

**Solution**: Install type definitions:

```bash
npm install --save-dev @types/chai @types/mocha @types/node
```

## Network Issues

### RPC Connection Failed

**Problem**: Cannot connect to network.

**Solution**:

1. Check network URL is correct
2. Verify network is accessible:

```bash
curl https://devnet.zama.ai
```

3. Try alternative RPC endpoint if available

### Transaction Stuck Pending

**Problem**: Transaction remains pending indefinitely.

**Solution**:

1. Check network status
2. Increase gas price:

```typescript
await contract.setValue(value, proof, {
  gasPrice: ethers.parseUnits('50', 'gwei'),
});
```

3. Cancel and resubmit with higher nonce if needed

## Common Mistakes

### Forgetting allowThis

**Problem**: Operations fail silently or revert.

**Solution**: Always call `FHE.allowThis()` for values the contract needs to use:

```solidity
function store(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allowThis(encValue); // Don't forget!
    stored = encValue;
}
```

### Reusing Encrypted Inputs

**Problem**: Second use of same encrypted input fails.

**Solution**: Create new encrypted input for each transaction:

```typescript
// ❌ Wrong - Reusing input
const input = instances.alice.createEncryptedInput(addr, alice.address);
input.add32(42);
const enc = await input.encrypt();

await contract.setValue(enc.handles[0], enc.inputProof); // OK
await contract.setValue(enc.handles[0], enc.inputProof); // Fails!

// ✅ Correct - New input each time
const input1 = instances.alice.createEncryptedInput(addr, alice.address);
input1.add32(42);
const enc1 = await input1.encrypt();
await contract.setValue(enc1.handles[0], enc1.inputProof); // OK

const input2 = instances.alice.createEncryptedInput(addr, alice.address);
input2.add32(42);
const enc2 = await input2.encrypt();
await contract.setValue(enc2.handles[0], enc2.inputProof); // OK
```

### Wrong Encrypted Type

**Problem**: Type mismatch errors or unexpected behavior.

**Solution**: Use correct type for your values:

```solidity
// ✅ Correct - Match value range to type
euint8 smallValue;   // 0-255
euint16 mediumValue; // 0-65535
euint32 largeValue;  // 0-4294967295

// ❌ Wrong - Value too large for type
euint8 value = FHE.asEuint8(1000); // Overflow!
```

## Getting Help

If you're still stuck:

1. **Check Documentation**: [FHEVM Docs](https://docs.zama.ai/fhevm)
2. **Search Issues**: [GitHub Issues](https://github.com/zama-ai/fhevm/issues)
3. **Ask Community**: [Zama Discord](https://discord.gg/zama)
4. **Review Examples**: Check working examples in this repository

## Reporting Bugs

When reporting issues, include:

- FHEVM version (`npm list @fhevm/solidity`)
- Hardhat version
- Node.js version
- Full error message
- Minimal reproduction code
- Steps to reproduce

This helps maintainers diagnose and fix issues quickly.
