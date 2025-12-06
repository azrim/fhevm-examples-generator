# Access Control

Manage permissions for encrypted data with FHE.allow(), FHE.allowThis(), and FHE.allowTransient().

## Overview

**Difficulty:** Intermediate
**Concepts:** Permission management, access control patterns

## What You'll Learn

- How FHE permissions work
- When to use allowThis vs allow
- Temporary permissions with allowTransient
- Multi-user access patterns

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract AccessControl is ZamaEthereumConfig {
    mapping(address => euint32) private balances;
    mapping(address => mapping(address => bool)) private accessGranted;

    function setBalance(externalEuint32 input, bytes calldata inputProof) external {
        euint32 balance = FHE.fromExternal(input, inputProof);
        balances[msg.sender] = balance;

        // Grant contract access (required)
        FHE.allowThis(balance);

        // Grant user access (required)
        FHE.allow(balance, msg.sender);
    }

    function getBalance(address user) external view returns (euint32) {
        require(user == msg.sender || accessGranted[user][msg.sender], "No access");
        return balances[user];
    }

    function grantAccess(address accessor) external {
        accessGranted[msg.sender][accessor] = true;

        // Grant permission to accessor
        FHE.allow(balances[msg.sender], accessor);
    }

    function transfer(address to, externalEuint32 amount, bytes calldata inputProof) external {
        euint32 transferAmount = FHE.fromExternal(amount, inputProof);

        // Subtract from sender
        balances[msg.sender] = FHE.sub(balances[msg.sender], transferAmount);

        // Add to recipient
        balances[to] = FHE.add(balances[to], transferAmount);

        // Update permissions
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }

    function hasContractAccess(address user) external view returns (bool) {
        return accessGranted[user][address(this)];
    }
}
```

## Permission Types

### FHE.allowThis()

Grants the contract permission to access the encrypted value.

```solidity
FHE.allowThis(encryptedValue);
```

**When to use:** Always! The contract needs permission to read its own encrypted state.

### FHE.allow()

Grants a specific address permission to decrypt the value.

```solidity
FHE.allow(encryptedValue, userAddress);
```

**When to use:** When a user needs to decrypt and read the value.

### FHE.allowTransient()

Grants temporary permission that doesn't persist.

```solidity
FHE.allowTransient(encryptedValue, userAddress);
```

**When to use:** For intermediate values that don't need permanent access.

## Permission Patterns

### Pattern 1: Owner-Only Access

```solidity
function store(externalEuint32 input, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(input, proof);
    data[msg.sender] = value;

    FHE.allowThis(value);
    FHE.allow(value, msg.sender);  // Only owner can decrypt
}
```

### Pattern 2: Shared Access

```solidity
function shareWith(address other) external {
    FHE.allow(data[msg.sender], other);  // Grant access to another user
}
```

### Pattern 3: Public Read

```solidity
function makePublic() external {
    // Grant access to everyone (not recommended for sensitive data!)
    FHE.allow(data[msg.sender], address(0));
}
```

### Pattern 4: Temporary Access

```solidity
function computeWithTemp(euint32 a, euint32 b) internal returns (euint32) {
    euint32 temp = FHE.add(a, b);
    FHE.allowTransient(temp, msg.sender);  // Temporary, not stored
    return temp;
}
```

## Common Mistakes

### ❌ Forgetting allowThis

```solidity
// Wrong - contract can't access its own state!
function store(externalEuint32 input, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(input, proof);
    data[msg.sender] = value;
    FHE.allow(value, msg.sender);  // Missing allowThis!
}
```

### ✅ Correct Pattern

```solidity
// Correct - both permissions granted
function store(externalEuint32 input, bytes calldata proof) external {
    euint32 value = FHE.fromExternal(input, proof);
    data[msg.sender] = value;
    FHE.allowThis(value);           // ✅ Contract access
    FHE.allow(value, msg.sender);   // ✅ User access
}
```

### ❌ Not Updating Permissions After Operations

```solidity
// Wrong - permissions not updated after operation
function add(euint32 amount) external {
    balance = FHE.add(balance, amount);
    // Missing permission updates!
}
```

### ✅ Correct Pattern

```solidity
// Correct - permissions updated
function add(euint32 amount) external {
    balance = FHE.add(balance, amount);
    FHE.allowThis(balance);           // ✅ Update contract access
    FHE.allow(balance, msg.sender);   // ✅ Update user access
}
```

## Multi-User Access Example

```solidity
contract SharedWallet {
    euint32 private balance;
    mapping(address => bool) private authorized;

    function deposit(externalEuint32 amount, bytes calldata proof) external {
        require(authorized[msg.sender], "Not authorized");

        euint32 value = FHE.fromExternal(amount, proof);
        balance = FHE.add(balance, value);

        FHE.allowThis(balance);

        // Grant access to all authorized users
        for (address user in authorizedUsers) {
            FHE.allow(balance, user);
        }
    }
}
```

## Security Best Practices

1. **Always grant allowThis** - Contract needs to access its state
2. **Grant allow to users** - Users need to decrypt their data
3. **Update permissions after operations** - New values need new permissions
4. **Use allowTransient for temps** - Saves gas for intermediate values
5. **Validate access before granting** - Check authorization first

## Next Steps

- [Input Proofs](input-proofs.md) - Validation patterns
- [Blind Auction](blind-auction.md) - Advanced access control
