# Encrypted Types

FHEVM provides encrypted versions of common Solidity types.

## Available Types

### Unsigned Integers

| Type | Bits | Range | Gas Cost |
|------|------|-------|----------|
| `euint8` | 8 | 0 to 255 | Low |
| `euint16` | 16 | 0 to 65,535 | Medium |
| `euint32` | 32 | 0 to 4,294,967,295 | High |
| `euint64` | 64 | 0 to 2^64-1 | Very High |

### Boolean

| Type | Values | Gas Cost |
|------|--------|----------|
| `ebool` | true/false | Low |

## Creating Encrypted Values

### From Plaintext

```solidity
euint32 value = FHE.asEuint32(42);
```

### From External Input

```solidity
function store(externalEuint32 input, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(input, proof);
    // Use value...
}
```

### From Another Encrypted Value

```solidity
euint32 a = FHE.asEuint32(10);
euint32 b = a;  // Copy encrypted value
```

## Type Conversions

### Upcasting (Safe)

```solidity
euint8 small = FHE.asEuint8(10);
euint32 large = FHE.asEuint32(small);  // OK
```

### Downcasting (Truncates)

```solidity
euint32 large = FHE.asEuint32(300);
euint8 small = FHE.asEuint8(large);  // Truncates to 44 (300 % 256)
```

## Best Practices

### Choose the Right Size

```solidity
// ✅ Good - use smallest type needed
euint8 age;        // 0-255 is enough
euint16 quantity;  // 0-65535 is enough

// ❌ Bad - unnecessarily large
euint64 age;       // Wastes gas
```

### Avoid Unnecessary Conversions

```solidity
// ❌ Bad
euint8 a = FHE.asEuint8(10);
euint32 b = FHE.asEuint32(a);
euint8 c = FHE.asEuint8(b);  // Unnecessary conversions

// ✅ Good
euint8 a = FHE.asEuint8(10);
euint8 c = a;  // Direct use
```

## Limitations

### No Signed Integers

```solidity
// ❌ Not available
eint32 value;  // Doesn't exist

// ✅ Use unsigned and handle sign separately
euint32 value;
ebool isNegative;
```

### No Floating Point

```solidity
// ❌ Not available
efloat value;  // Doesn't exist

// ✅ Use fixed-point arithmetic
euint32 value;  // Represents value * 10^6
```

### No Dynamic Arrays

```solidity
// ❌ Not available
euint32[] values;  // Doesn't work

// ✅ Use fixed-size arrays or mappings
euint32[10] values;
mapping(uint256 => euint32) values;
```

## Next Steps

- [FHE Operations](fhe-operations.md) - Operations on encrypted types
- [Permission System](permissions.md) - Access control
