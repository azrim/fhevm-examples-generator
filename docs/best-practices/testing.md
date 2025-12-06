# Testing Strategies

Testing FHEVM contracts requires understanding encrypted operations and the unique testing environment provided by the FHEVM Hardhat plugin.
Testing Environment Setup

### Basic Test Structure

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { createInstances } from "../instance";
import { getSigners, initSigners } from "../signers";
import { deployYourContractFixture } from "./YourContract.fixture";

describe("YourContract", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const deployment = await deployYourContractFixture();
    this.contractAddress = await deployment.contract.getAddress();
    this.contract = deployment.contract;
    this.instances = await createInstances(this.contractAddress, ethers, this.signers);
  });

  it("should perform encrypted operation", async function () {
    // Your test logic
  });
});
```

### Key Testing Components

**1. Signers Management**

- Initialize signers before tests
- Use consistent signers across test suite
- Each signer has their own FHE instance

**2. FHE Instances**

- Create instances for each contract address
- Each user needs their own instance
- Instances handle encryption/decryption

**3. Fixtures**

- Use deployment fixtures for consistency
- Reset state between tests
- Faster than redeploying each time

## Testing Encrypted Values

### Creating Encrypted Inputs

```typescript
it("should handle encrypted input correctly", async function () {
  const input = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );

  input.add32(42);
  const encryptedInput = await input.encrypt();

  await this.contract
    .connect(this.signers.alice)
    .setValue(encryptedInput.handles[0], encryptedInput.inputProof);
});
```

**Important**: The signer creating the input must match the transaction signer.

### Decrypting for Assertions

```typescript
it("should decrypt value correctly", async function () {
  // Set encrypted value
  const input = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input.add32(100);
  const encryptedInput = await input.encrypt();

  await this.contract
    .connect(this.signers.alice)
    .setValue(encryptedInput.handles[0], encryptedInput.inputProof);

  // Get encrypted handle
  const handle = await this.contract.getValue(this.signers.alice.address);

  // Decrypt and verify
  const decrypted = await this.instances.alice.decrypt(this.contractAddress, handle);
  expect(decrypted).to.equal(100);
});
```

## Testing Permission System

### Testing Access Control

```typescript
describe("Permission System", function () {
  it("should allow owner to decrypt", async function () {
    const handle = await this.contract.getEncryptedValue();
    const decrypted = await this.instances.alice.decrypt(this.contractAddress, handle);
    expect(decrypted).to.not.be.undefined;
  });

  it("should deny unauthorized user", async function () {
    const handle = await this.contract.getEncryptedValue();

    // Bob tries to decrypt Alice's value
    await expect(this.instances.bob.decrypt(this.contractAddress, handle)).to.be.rejected;
  });
});
```

### Testing Permission Grants

```typescript
it("should grant permission to another user", async function () {
  // Alice grants permission to Bob
  await this.contract.connect(this.signers.alice).grantPermission(this.signers.bob.address);

  const handle = await this.contract.getEncryptedValue();

  // Bob can now decrypt
  const decrypted = await this.instances.bob.decrypt(this.contractAddress, handle);
  expect(decrypted).to.equal(42);
});
```

## Testing Common Patterns

### Testing Arithmetic Operations

```typescript
it("should add encrypted values correctly", async function () {
  // Set first value
  const input1 = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input1.add32(10);
  const enc1 = await input1.encrypt();

  await this.contract.connect(this.signers.alice).setValueA(enc1.handles[0], enc1.inputProof);

  // Set second value
  const input2 = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input2.add32(20);
  const enc2 = await input2.encrypt();

  await this.contract.connect(this.signers.alice).setValueB(enc2.handles[0], enc2.inputProof);

  // Perform addition
  await this.contract.connect(this.signers.alice).add();

  // Verify result
  const resultHandle = await this.contract.getResult();
  const result = await this.instances.alice.decrypt(this.contractAddress, resultHandle);
  expect(result).to.equal(30);
});
```

### Testing Conditional Logic

```typescript
it("should execute conditional correctly", async function () {
  const input = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input.addBool(true);
  const encInput = await input.encrypt();

  await this.contract.connect(this.signers.alice).setCondition(encInput.handles[0], encInput.inputProof);

  await this.contract.connect(this.signers.alice).executeConditional();

  const resultHandle = await this.contract.getResult();
  const result = await this.instances.alice.decrypt(this.contractAddress, resultHandle);
  expect(result).to.equal(100); // Value when condition is true
});
```

## Testing Error Cases

### Invalid Input Proofs

```typescript
it("should reject invalid input proof", async function () {
  const input = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input.add32(42);
  const encInput = await input.encrypt();

  // Use wrong signer
  await expect(
    this.contract.connect(this.signers.bob).setValue(encInput.handles[0], encInput.inputProof),
  ).to.be.reverted;
});
```

### Missing Permissions

```typescript
it("should fail without allowThis", async function () {
  // Contract that forgets to call FHE.allowThis
  await expect(this.contract.connect(this.signers.alice).getValueWithoutPermission()).to.be.reverted;
});
```

## Performance Testing

### Gas Usage

```typescript
it("should measure gas for encrypted operations", async function () {
  const input = this.instances.alice.createEncryptedInput(
    this.contractAddress,
    this.signers.alice.address,
  );
  input.add32(42);
  const encInput = await input.encrypt();

  const tx = await this.contract
    .connect(this.signers.alice)
    .setValue(encInput.handles[0], encInput.inputProof);

  const receipt = await tx.wait();
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  // Assert reasonable gas limits
  expect(receipt.gasUsed).to.be.lessThan(500000);
});
```

## Best Practices

### ✅ DO

- **Use fixtures** for consistent test setup
- **Test both success and failure cases**
- **Verify permissions** are correctly set
- **Test with multiple users** to ensure isolation
- **Clean up state** between tests
- **Use descriptive test names** that explain the scenario
- **Group related tests** in describe blocks

### ❌ DON'T

- **Don't reuse encrypted inputs** across tests
- **Don't assume decryption will succeed** without permissions
- **Don't mix signers** when creating inputs and sending transactions
- **Don't skip error case testing**
- **Don't test with only one user** when multi-user scenarios exist

## Common Testing Patterns

### Multi-User Scenarios

```typescript
describe("Multi-User Operations", function () {
  it("should handle multiple users independently", async function () {
    // Alice sets her value
    const aliceInput = this.instances.alice.createEncryptedInput(
      this.contractAddress,
      this.signers.alice.address,
    );
    aliceInput.add32(100);
    const aliceEnc = await aliceInput.encrypt();

    await this.contract.connect(this.signers.alice).setValue(aliceEnc.handles[0], aliceEnc.inputProof);

    // Bob sets his value
    const bobInput = this.instances.bob.createEncryptedInput(
      this.contractAddress,
      this.signers.bob.address,
    );
    bobInput.add32(200);
    const bobEnc = await bobInput.encrypt();

    await this.contract.connect(this.signers.bob).setValue(bobEnc.handles[0], bobEnc.inputProof);

    // Verify both values are independent
    const aliceHandle = await this.contract.getValue(this.signers.alice.address);
    const bobHandle = await this.contract.getValue(this.signers.bob.address);

    const aliceValue = await this.instances.alice.decrypt(this.contractAddress, aliceHandle);
    const bobValue = await this.instances.bob.decrypt(this.contractAddress, bobHandle);

    expect(aliceValue).to.equal(100);
    expect(bobValue).to.equal(200);
  });
});
```

### Time-Based Testing

```typescript
it("should handle time-based logic", async function () {
  // Set initial state
  await this.contract.connect(this.signers.alice).start();

  // Fast forward time
  await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
  await ethers.provider.send("evm_mine", []);

  // Test time-dependent behavior
  await this.contract.connect(this.signers.alice).finalize();

  const resultHandle = await this.contract.getResult();
  const result = await this.instances.alice.decrypt(this.contractAddress, resultHandle);
  expect(result).to.be.greaterThan(0);
});
```

## Debugging Tips

### Enable Verbose Logging

```typescript
// In your test file
import { setLogLevel } from "@fhevm/hardhat-plugin";

before(async function () {
  setLogLevel("debug");
});
```

### Inspect Encrypted Handles

```typescript
it("should log encrypted handle", async function () {
  const handle = await this.contract.getEncryptedValue();
  console.log("Encrypted handle:", handle);

  // Verify handle is valid (non-zero)
  expect(handle).to.not.equal(0);
});
```

### Test Isolation

```typescript
// Use snapshot/revert for complex state
let snapshotId: string;

beforeEach(async function () {
  snapshotId = await ethers.provider.send("evm_snapshot", []);
});

afterEach(async function () {
  await ethers.provider.send("evm_revert", [snapshotId]);
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/YourContract.test.ts

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

## Summary

Effective FHEVM testing requires:

- Understanding the encryption/decryption flow
- Proper permission management
- Multi-user scenario testing
- Both positive and negative test cases
- Performance and gas optimization validation

Follow these patterns to build robust, well-tested FHEVM applications.
