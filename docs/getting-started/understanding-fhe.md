# Understanding FHE

Fully Homomorphic Encryption (FHE) allows computations on encrypted data without decryption.

## Why FHE Matters

Traditional blockchain is transparent - everyone can see all data. FHE enables:

- **Privacy** - Keep sensitive data encrypted
- **Compliance** - Meet regulatory requirements
- **Security** - Protect user information
- **Innovation** - Build new types of applications

## How It Works

### 1. Encryption

Data is encrypted client-side before sending to the blockchain:

```typescript
const fhevm = await getFHEVM();
const input = await fhevm.createEncryptedInput(contractAddress, userAddress);
input.add32(42);  // Encrypt the number 42
const encrypted = await input.encrypt();
```

### 2. Computation

Smart contracts perform operations on encrypted data:

```solidity
euint32 a = FHE.asEuint32(10);  // Encrypted 10
euint32 b = FHE.asEuint32(20);  // Encrypted 20
euint32 result = FHE.add(a, b); // Encrypted 30 (computed without decryption!)
```

### 3. Decryption

Only authorized parties can decrypt results:

```typescript
const decrypted = await fhevm.decrypt(contractAddress, encryptedValue);
console.log(decrypted); // 30
```

## Key Concepts

### Encrypted Types

FHEVM provides encrypted versions of common types:

| Type | Description | Range |
|------|-------------|-------|
| `euint8` | 8-bit unsigned integer | 0 to 255 |
| `euint16` | 16-bit unsigned integer | 0 to 65,535 |
| `euint32` | 32-bit unsigned integer | 0 to 4,294,967,295 |
| `euint64` | 64-bit unsigned integer | 0 to 2^64-1 |
| `ebool` | Boolean | true/false |

### Supported Operations

#### Arithmetic
- Addition: `FHE.add(a, b)`
- Subtraction: `FHE.sub(a, b)`
- Multiplication: `FHE.mul(a, b)`

#### Comparison
- Equal: `FHE.eq(a, b)`
- Not equal: `FHE.ne(a, b)`
- Less than: `FHE.lt(a, b)`
- Greater than: `FHE.gt(a, b)`

#### Logical
- AND: `FHE.and(a, b)`
- OR: `FHE.or(a, b)`
- NOT: `FHE.not(a)`

#### Selection
- Conditional: `FHE.select(condition, ifTrue, ifFalse)`

## Encryption Binding

FHE values are bound to `[contract, user]` pairs for security:

```solidity
// Value is bound to this contract and msg.sender
euint32 value = FHE.fromExternal(inputValue, inputProof);
```

This prevents:
- Replay attacks
- Cross-contract attacks
- Unauthorized access

## Permission System

Control who can access encrypted data:

```solidity
// Grant contract access
FHE.allowThis(encryptedValue);

// Grant user access
FHE.allow(encryptedValue, userAddress);

// Temporary access (doesn't persist)
FHE.allowTransient(encryptedValue, userAddress);
```

## Limitations

### What You CAN'T Do

- **Division** - Not supported (use multiplication by inverse)
- **Modulo** - Not available
- **Direct comparison** - Use `FHE.eq()`, not `==`
- **Loops over encrypted values** - Must be unrolled

### Gas Costs

FHE operations are more expensive than regular operations:

| Operation | Approximate Gas |
|-----------|----------------|
| `FHE.add()` | ~50,000 |
| `FHE.mul()` | ~150,000 |
| `FHE.eq()` | ~30,000 |

Plan your contract design accordingly!

## Best Practices

1. **Minimize FHE operations** - They're expensive
2. **Batch operations** - Combine multiple operations when possible
3. **Use appropriate types** - Smaller types (euint8) are cheaper
4. **Grant permissions carefully** - Only to necessary addresses
5. **Test thoroughly** - FHE behavior differs from regular operations

## Next Steps

- [Encrypted Types](../concepts/encrypted-types.md) - Detailed type reference
- [FHE Operations](../concepts/fhe-operations.md) - Complete operations guide
- [Permission System](../concepts/permissions.md) - Access control patterns
