# Gas Optimization

Strategies for optimizing gas costs in FHEVM smart contracts.

## Understanding FHE Ga

Encrypted operations are more expensive than regular operations:

- **Regular addition**: ~3 gas
- **FHE addition (euint32)**: ~65,000 gas
- **FHE multiplication**: ~150,000 gas
- **FHE comparison**: ~70,000 gas

Optimization is critical for practical FHEVM applications.

## Minimize Encrypted Operations

### Batch Operations

Combine multiple operations when possible:

```solidity
// ❌ INEFFICIENT - Multiple separate operations
function inefficient(euint32 a, euint32 b, euint32 c) public {
    euint32 temp1 = FHE.add(a, b);
    FHE.allowThis(temp1);
    euint32 temp2 = FHE.add(temp1, c);
    FHE.allowThis(temp2);
    result = temp2;
}

// ✅ EFFICIENT - Batched operations
function efficient(euint32 a, euint32 b, euint32 c) public {
    result = FHE.add(FHE.add(a, b), c);
    FHE.allowThis(result);
}
```

### Avoid Redundant Operations

Don't perform the same operation multiple times:

```solidity
// ❌ INEFFICIENT - Redundant operations
function inefficient(euint32 a, euint32 b) public {
    if (someCondition) {
        result = FHE.add(a, b);
    } else {
        result = FHE.add(a, b); // Same operation!
    }
    FHE.allowThis(result);
}

// ✅ EFFICIENT - Calculate once
function efficient(euint32 a, euint32 b) public {
    euint32 sum = FHE.add(a, b);
    if (someCondition) {
        result = sum;
    } else {
        result = sum;
    }
    FHE.allowThis(result);
}
```

## Optimize Permission Grants

### Grant Permissions Selectively

Only call `FHE.allow()` when users need to decrypt:

```solidity
// ❌ INEFFICIENT - Always grants permission
function deposit(einput amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.asEuint32(amount, inputProof);
    FHE.allowThis(encAmount);
    FHE.allow(encAmount, msg.sender); // Unnecessary if user won't decrypt

    balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
}

// ✅ EFFICIENT - Grant permission only when needed
function deposit(einput amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.asEuint32(amount, inputProof);
    FHE.allowThis(encAmount);

    balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
}

function getBalance() public view returns (euint32) {
    euint32 balance = balances[msg.sender];
    FHE.allow(balance, msg.sender); // Grant only when user requests
    return balance;
}
```

### Batch Permission Grants

If granting multiple permissions, consider the pattern:

```solidity
// ✅ EFFICIENT - Batch permission grants
function grantPermissions(address user) public {
    FHE.allow(value1, user);
    FHE.allow(value2, user);
    FHE.allow(value3, user);
}
```

## Use Appropriate Types

### Choose Smallest Sufficient Type

Smaller encrypted types consume less gas:

```solidity
// ❌ INEFFICIENT - Oversized type
euint32 age; // 0-4,294,967,295 range for age?

// ✅ EFFICIENT - Right-sized type
euint8 age;  // 0-255 is sufficient for age
```

**Gas costs by type** (approximate):

- `euint8`: ~50,000 gas per operation
- `euint16`: ~55,000 gas per operation
- `euint32`: ~65,000 gas per operation
- `euint64`: ~80,000 gas per operation

### Type Conversion Costs

Avoid unnecessary type conversions:

```solidity
// ❌ INEFFICIENT - Unnecessary conversions
function inefficient(euint8 a) public {
    euint32 b = FHE.asEuint32(FHE.asEuint16(a)); // Double conversion
    result = FHE.add(b, FHE.asEuint32(1));
}

// ✅ EFFICIENT - Direct conversion
function efficient(euint8 a) public {
    euint32 b = FHE.asEuint32(a); // Single conversion
    result = FHE.add(b, FHE.asEuint32(1));
}
```

## Optimize Storage

### Minimize Storage Operations

Storage operations are expensive, even more so with encrypted values:

```solidity
// ❌ INEFFICIENT - Multiple storage writes
function inefficient(einput a, einput b, bytes calldata proofA, bytes calldata proofB) public {
    euint32 encA = FHE.asEuint32(a, proofA);
    FHE.allowThis(encA);
    value = encA; // Storage write

    euint32 encB = FHE.asEuint32(b, proofB);
    FHE.allowThis(encB);
    value = FHE.add(value, encB); // Storage read + write
}

// ✅ EFFICIENT - Single storage write
function efficient(einput a, einput b, bytes calldata proofA, bytes calldata proofB) public {
    euint32 encA = FHE.asEuint32(a, proofA);
    FHE.allowThis(encA);

    euint32 encB = FHE.asEuint32(b, proofB);
    FHE.allowThis(encB);

    value = FHE.add(encA, encB); // Single storage write
}
```

### Use Memory for Intermediate Values

Keep intermediate calculations in memory:

```solidity
// ✅ EFFICIENT - Memory variables
function calculate(euint32 a, euint32 b, euint32 c) public {
    euint32 temp1 = FHE.add(a, b);      // Memory
    euint32 temp2 = FHE.mul(temp1, c);  // Memory
    result = temp2;                      // Single storage write
    FHE.allowThis(result);
}
```

## Optimize Conditional Logic

### Use FHE.select Instead of Branches

`FHE.select` is more efficient than conditional logic:

```solidity
// ❌ LESS EFFICIENT - Conditional logic
function inefficient(euint32 a, euint32 b) public {
    ebool condition = FHE.gt(a, b);
    if (FHE.decrypt(condition)) {
        result = a;
    } else {
        result = b;
    }
    FHE.allowThis(result);
}

// ✅ MORE EFFICIENT - FHE.select
function efficient(euint32 a, euint32 b) public {
    ebool condition = FHE.gt(a, b);
    result = FHE.select(condition, a, b);
    FHE.allowThis(result);
}
```

### Minimize Comparisons

Comparisons are expensive:

```solidity
// ❌ INEFFICIENT - Multiple comparisons
function inefficient(euint32 value) public {
    ebool gt10 = FHE.gt(value, FHE.asEuint32(10));
    ebool gt20 = FHE.gt(value, FHE.asEuint32(20));
    ebool gt30 = FHE.gt(value, FHE.asEuint32(30));
    // Use comparisons...
}

// ✅ EFFICIENT - Minimal comparisons
function efficient(euint32 value) public {
    ebool inRange = FHE.and(
        FHE.gt(value, FHE.asEuint32(10)),
        FHE.lt(value, FHE.asEuint32(30))
    );
    // Use single comparison result
}
```

## Optimize Multiplication

### Prefer Addition Over Multiplication

Addition is cheaper than multiplication:

```solidity
// ❌ LESS EFFICIENT - Multiplication
function double(euint32 value) public {
    result = FHE.mul(value, FHE.asEuint32(2));
    FHE.allowThis(result);
}

// ✅ MORE EFFICIENT - Addition
function double(euint32 value) public {
    result = FHE.add(value, value);
    FHE.allowThis(result);
}
```

### Avoid Unnecessary Multiplications

```solidity
// ❌ INEFFICIENT - Multiply by 1
function inefficient(euint32 value) public {
    result = FHE.mul(value, FHE.asEuint32(1)); // Pointless
    FHE.allowThis(result);
}

// ✅ EFFICIENT - Direct assignment
function efficient(euint32 value) public {
    result = value;
    FHE.allowThis(result);
}
```

## Optimize Input Handling

### Validate Before Encryption

Validate plaintext inputs before encrypting:

```solidity
// ✅ EFFICIENT - Validate first
function deposit(einput amount, bytes calldata inputProof) public {
    // Cheap validation before expensive encryption
    require(msg.value > 0, "Must send ETH");

    euint32 encAmount = FHE.asEuint32(amount, inputProof);
    FHE.allowThis(encAmount);

    balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
}
```

### Reuse Encrypted Values

Don't re-encrypt the same value:

```solidity
// ❌ INEFFICIENT - Re-encrypting constants
function inefficient() public {
    euint32 zero = FHE.asEuint32(0);
    euint32 one = FHE.asEuint32(1);
    // Use zero and one...
}

// ✅ EFFICIENT - Store constants
euint32 private constant ZERO = FHE.asEuint32(0);
euint32 private constant ONE = FHE.asEuint32(1);

function efficient() public {
    // Use ZERO and ONE...
}
```

## Optimize Loops

### Minimize Loop Iterations

Avoid loops with encrypted operations when possible:

```solidity
// ❌ INEFFICIENT - Loop with encrypted operations
function sumArray(euint32[] memory values) public {
    euint32 sum = FHE.asEuint32(0);
    for (uint i = 0; i < values.length; i++) {
        sum = FHE.add(sum, values[i]); // Expensive in loop
    }
    result = sum;
    FHE.allowThis(result);
}

// ✅ MORE EFFICIENT - Minimize iterations
function sumArray(euint32[] memory values) public {
    require(values.length <= 10, "Too many values"); // Limit iterations
    euint32 sum = FHE.asEuint32(0);
    for (uint i = 0; i < values.length; i++) {
        sum = FHE.add(sum, values[i]);
    }
    result = sum;
    FHE.allowThis(result);
}
```

## Gas Estimation

### Measure Gas Usage

Always measure gas costs in tests:

```typescript
it("should measure gas usage", async function () {
  const tx = await contract.performOperation();
  const receipt = await tx.wait();
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  // Assert reasonable limits
  expect(receipt.gasUsed).to.be.lessThan(500000);
});
```

### Compare Implementations

Test different approaches:

```typescript
describe("Gas Optimization", function () {
  it("approach A gas usage", async function () {
    const tx = await contract.approachA();
    const receipt = await tx.wait();
    console.log(`Approach A: ${receipt.gasUsed.toString()}`);
  });

  it("approach B gas usage", async function () {
    const tx = await contract.approachB();
    const receipt = await tx.wait();
    console.log(`Approach B: ${receipt.gasUsed.toString()}`);
  });
});
```

## Best Practices Summary

### ✅ DO

- Use smallest appropriate encrypted types
- Batch operations when possible
- Grant permissions selectively
- Use `FHE.select` for conditionals
- Prefer addition over multiplication
- Minimize storage operations
- Validate before encrypting
- Measure gas usage in tests

### ❌ DON'T

- Use oversized types
- Perform redundant operations
- Grant unnecessary permissions
- Use loops with encrypted operations
- Re-encrypt constants
- Perform unnecessary type conversions
- Write to storage multiple times

## Gas Cost Reference

Approximate gas costs for common operations:

| Operation            | Gas Cost  |
| -------------------- | --------- |
| FHE.add (euint32)    | ~65,000   |
| FHE.sub (euint32)    | ~65,000   |
| FHE.mul (euint32)    | ~150,000  |
| FHE.div (euint32)    | ~200,000  |
| FHE.gt (euint32)     | ~70,000   |
| FHE.eq (euint32)     | ~70,000   |
| FHE.select (euint32) | ~80,000   |
| FHE.allowThis        | ~30,000   |
| FHE.allow            | ~30,000   |
| FHE.asEuint32        | ~50,000   |
| FHE.decrypt          | ~100,000+ |

_Note: Actual costs vary by network and operation complexity._

## Resources

- [FHEVM Gas Optimization Guide](https://docs.zama.ai/fhevm/gas-optimization)
- [Ethereum Gas Optimization](https://ethereum.org/en/developers/docs/gas/)

## Summary

Optimizing FHEVM contracts requires:

- Understanding FHE operation costs
- Choosing appropriate encrypted types
- Minimizing encrypted operations
- Selective permission management
- Efficient storage patterns
- Regular gas measurement

Always profile and measure to find the best optimizations for your specific use case.

