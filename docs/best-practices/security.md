# Security Guidelines

Security best practices for building FHEVM smart contracts.

## Permission Management

### Always Grant Bissions

The most critical security pattern in FHEVM is proper permission management. Every encrypted value needs **both** contract and user permissions.

```solidity
// ✅ CORRECT - Both permissions granted
function setValue(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allowThis(encValue);        // Contract can use it
    FHE.allow(encValue, msg.sender); // User can decrypt it
    values[msg.sender] = encValue;
}

// ❌ WRONG - Missing allowThis
function setValue(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allow(encValue, msg.sender); // User permission only
    values[msg.sender] = encValue;   // Contract can't use this!
}
```

### Restrict Permission Grants

Only grant decryption permissions to authorized addresses:

```solidity
// ✅ CORRECT - Controlled permission grants
mapping(address => bool) public authorized;

function grantPermission(euint32 value, address user) public {
    require(authorized[user], "User not authorized");
    FHE.allow(value, user);
}

// ❌ WRONG - Anyone can get permission
function grantPermission(euint32 value, address user) public {
    FHE.allow(value, user); // No access control!
}
```

### Revoke Permissions When Needed

While FHEVM doesn't have explicit permission revocation, you can implement access control patterns:

```solidity
mapping(address => mapping(address => bool)) private permissions;

function grantAccess(address user) public {
    permissions[msg.sender][user] = true;
}

function revokeAccess(address user) public {
    permissions[msg.sender][user] = false;
}

function getValue(address owner) public view returns (euint32) {
    require(
        msg.sender == owner || permissions[owner][msg.sender],
        "No permission"
    );
    return values[owner];
}
```

## Input Validation

### Validate Input Proofs

Always validate that input proofs match the transaction sender:

```solidity
// ✅ CORRECT - Input proof is validated automatically
function setValue(einput value, bytes calldata inputProof) public {
    // FHE.asEuint32 validates that inputProof matches msg.sender
    euint32 encValue = FHE.asEuint32(value, inputProof);
    FHE.allowThis(encValue);
    FHE.allow(encValue, msg.sender);
    values[msg.sender] = encValue;
}
```

The FHEVM library automatically validates input proofs, but be aware that mismatched signers will cause reverts.

### Validate Encrypted Handles

Check that encrypted handles are valid before using them:

```solidity
// ✅ CORRECT - Check handle validity
function useValue(euint32 value) internal {
    // Operations on invalid handles will revert
    // Always ensure values are properly initialized
    require(FHE.isInitialized(value), "Value not initialized");
    result = FHE.add(value, FHE.asEuint32(1));
}
```

## Access Control

### Implement Role-Based Access

Use standard access control patterns with encrypted values:

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureVault is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(address => euint32) private balances;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function grantDecryptPermission(address user) public onlyRole(ADMIN_ROLE) {
        euint32 balance = balances[user];
        FHE.allow(balance, user);
    }
}
```

### Owner-Only Operations

Protect sensitive operations:

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConfidentialContract is Ownable {
    euint32 private secretValue;

    constructor() Ownable(msg.sender) {
        secretValue = FHE.asEuint32(0);
        FHE.allowThis(secretValue);
    }

    function updateSecret(einput value, bytes calldata inputProof) public onlyOwner {
        secretValue = FHE.asEuint32(value, inputProof);
        FHE.allowThis(secretValue);
    }
}
```

## Data Privacy

### Minimize Permission Grants

Only grant permissions when absolutely necessary:

```solidity
// ✅ CORRECT - Selective permission grants
function withdraw() public {
    euint32 balance = balances[msg.sender];
    // Only grant permission when user needs to see balance
    FHE.allow(balance, msg.sender);
}

// ❌ WRONG - Unnecessary permission grants
function deposit(einput amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.asEuint32(amount, inputProof);
    FHE.allowThis(encAmount);
    FHE.allow(encAmount, msg.sender); // Not needed if user won't decrypt
    balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
}
```

### Avoid Leaking Information

Be careful not to leak information through public functions:

```solidity
// ❌ WRONG - Leaks information
function isBalanceGreaterThan100(address user) public view returns (bool) {
    // This reveals information about encrypted balance!
    return FHE.decrypt(FHE.gt(balances[user], FHE.asEuint32(100)));
}

// ✅ CORRECT - Keep comparisons encrypted
function getBalanceComparison(address user) public view returns (ebool) {
    require(msg.sender == user, "Not authorized");
    ebool result = FHE.gt(balances[user], FHE.asEuint32(100));
    FHE.allow(result, user);
    return result;
}
```

## Reentrancy Protection

### Use ReentrancyGuard

Protect against reentrancy attacks:

```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureVault is ReentrancyGuard {
    mapping(address => euint32) private balances;

    function withdraw(uint256 amount) public nonReentrant {
        euint32 balance = balances[msg.sender];
        // Decrypt and validate
        uint256 decryptedBalance = FHE.decrypt(balance);
        require(decryptedBalance >= amount, "Insufficient balance");

        // Update state before external call
        balances[msg.sender] = FHE.sub(balance, FHE.asEuint32(amount));

        // External call
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

## Integer Overflow Protection

### Use Appropriate Types

Choose encrypted types that match your value ranges:

```solidity
// ✅ CORRECT - Appropriate types
euint8 age;        // 0-255
euint16 score;     // 0-65535
euint32 balance;   // 0-4294967295

// ❌ WRONG - Type too small
euint8 balance;    // Will overflow for large balances!
```

### Check for Overflows

While FHE operations don't overflow in the traditional sense, be mindful of type limits:

```solidity
// ✅ CORRECT - Use appropriate type
function addBalance(einput amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.asEuint32(amount, inputProof);
    FHE.allowThis(encAmount);

    // euint32 can handle large balances
    balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
}
```

## Time-Based Security

### Implement Timelocks

Add time-based restrictions for sensitive operations:

```solidity
contract TimelockVault {
    mapping(address => euint32) private balances;
    mapping(address => uint256) private unlockTime;

    function deposit(einput amount, bytes calldata inputProof) public {
        euint32 encAmount = FHE.asEuint32(amount, inputProof);
        FHE.allowThis(encAmount);

        balances[msg.sender] = FHE.add(balances[msg.sender], encAmount);
        unlockTime[msg.sender] = block.timestamp + 1 days;
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime[msg.sender], "Still locked");
        // Withdrawal logic
    }
}
```

## Audit Checklist

Before deploying FHEVM contracts, verify:

- [ ] All encrypted values have `FHE.allowThis()` called
- [ ] User permissions are granted only when necessary
- [ ] Access control is implemented for sensitive functions
- [ ] Input proofs are validated (automatic with `FHE.asEuintX`)
- [ ] Encrypted types match expected value ranges
- [ ] No information leakage through public functions
- [ ] Reentrancy protection is in place
- [ ] Time-based restrictions are implemented where needed
- [ ] Error handling is comprehensive
- [ ] Events are emitted for important state changes

## Common Vulnerabilities

### Missing allowThis

```solidity
// ❌ VULNERABLE
function store(einput value, bytes calldata inputProof) public {
    euint32 encValue = FHE.asEuint32(value, inputProof);
    // Missing FHE.allowThis(encValue)
    stored = encValue; // Contract can't use this value!
}
```

### Unrestricted Permission Grants

```solidity
// ❌ VULNERABLE
function shareValue(address recipient) public {
    // No access control - anyone can share anyone's value!
    FHE.allow(values[msg.sender], recipient);
}
```

### Information Leakage

```solidity
// ❌ VULNERABLE
function checkBalance(address user) public view returns (bool) {
    // Leaks whether balance > 1000
    return FHE.decrypt(FHE.gt(balances[user], FHE.asEuint32(1000)));
}
```

## Testing Security

Always test security-critical functionality:

```typescript
describe('Security Tests', function () {
  it('should prevent unauthorized access', async function () {
    // Alice sets her value
    await contract.connect(alice).setValue(encryptedValue);

    // Bob should not be able to decrypt Alice's value
    await expect(instances.bob.decrypt(contractAddress, aliceHandle)).to.be.rejected;
  });

  it('should validate input proof signer', async function () {
    const input = instances.alice.createEncryptedInput(contractAddress, alice.address);
    input.add32(42);
    const enc = await input.encrypt();

    // Should fail when Bob tries to use Alice's input
    await expect(contract.connect(bob).setValue(enc.handles[0], enc.inputProof)).to.be.reverted;
  });
});
```

## Resources

- [FHEVM Security Best Practices](https://docs.zama.ai/fhevm/security)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)

## Summary

Security in FHEVM contracts requires:

- Proper permission management (both `allowThis` and `allow`)
- Strict access control
- Careful handling of encrypted data
- Protection against common vulnerabilities
- Comprehensive testing

Always prioritize security over convenience when building confidential smart contracts.
