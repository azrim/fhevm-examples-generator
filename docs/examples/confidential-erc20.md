# Confidential ERC20

A confidential ERC20 token implementation following the ERC-7984 standard.

## Overview

**Difficulty:** Advanced
**Concepts:** Token standard, encrypted balances, confidential transfers

## What You'll Learn

- ERC-7984 confidential token standard
- Encrypted balance management
- Confidential transfers and approvals
- Token economics with privacy

## The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialERC20 is ZamaEthereumConfig {
    string public name;
    string public symbol;
    uint8 public decimals;
    euint32 private totalSupply;

    mapping(address => euint32) private balances;
    mapping(address => mapping(address => euint32)) private allowances;

    event Transfer(address indexed from, address indexed to);
    event Approval(address indexed owner, address indexed spender);
    event Mint(address indexed to, uint32 amount);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function mint(address to, uint32 amount) public {
        euint32 encryptedAmount = FHE.asEuint32(amount);

        balances[to] = FHE.add(balances[to], encryptedAmount);
        totalSupply = FHE.add(totalSupply, encryptedAmount);

        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
        FHE.allowThis(totalSupply);

        emit Mint(to, amount);
    }

    function transfer(address to, externalEuint32 inputAmount, bytes calldata inputProof) public returns (bool) {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);

        balances[msg.sender] = FHE.sub(balances[msg.sender], amount);
        balances[to] = FHE.add(balances[to], amount)

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);

        emit Transfer(msg.sender, to);
        return true;
    }

    function approve(address spender, externalEuint32 inputAmount, bytes calldata inputProof) public returns (bool) {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);

        allowances[msg.sender][spender] = amount;
        FHE.allowThis(amount);
        FHE.allow(amount, spender);

        emit Approval(msg.sender, spender);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        externalEuint32 inputAmount,
        bytes calldata inputProof
    ) public returns (bool) {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);

        balances[from] = FHE.sub(balances[from], amount);
        balances[to] = FHE.add(balances[to], amount);
        allowances[from][msg.sender] = FHE.sub(allowances[from][msg.sender], amount);

        FHE.allowThis(balances[from]);
        FHE.allow(balances[from], from);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
        FHE.allowThis(allowances[from][msg.sender]);
        FHE.allow(allowances[from][msg.sender], msg.sender);

        emit Transfer(from, to);
        return true;
    }

    function balanceOf(address account) public view returns (euint32) {
        return balances[account];
    }

    function allowance(address owner, address spender) public view returns (euint32) {
        return allowances[owner][spender];
    }

    function getTotalSupply() public view returns (euint32) {
        return totalSupply;
    }
}
```

## ERC-7984 Standard

ERC-7984 is the confidential token standard that extends ERC-20 with encrypted balances.

### Key Differences from ERC-20

| Feature | ERC-20 | ERC-7984 |
|---------|--------|----------|
| Balances | `uint256` (public) | `euint32` (encrypted) |
| Transfers | Amount visible | Amount hidden |
| Allowances | Amount visible | Amount hidden |
| Total Supply | Public | Encrypted |

## Usage Examples

### Minting Tokens

```typescript
// Mint 1000 tokens to Alice (plaintext for simplicity)
await token.mint(alice.address, 1000);
```

### Transferring Tokens

```typescript
// Alice transfers 100 tokens to Bob (encrypted)
const input = await fhevm.createEncryptedInput(
  await token.getAddress(),
  alice.address
);
input.add32(100);
const encrypted = await input.encrypt();

await token.connect(alice).transfer(
  bob.address,
  encrypted.handles[0],
  encrypted.inputProof
);
```

### Approving Spender

```typescript
// Alice approves Bob to spend 50 tokens
const input = await fhevm.createEncryptedInput(
  await token.getAddress(),
  alice.address
);
input.add32(50);
const encrypted = await input.encrypt();

await token.connect(alice).approve(
  bob.address,
  encrypted.handles[0],
  encrypted.inputProof
);
```

### TransferFrom

```typescript
// Bob transfers 30 tokens from Alice to Charlie
const input = await fhevm.createEncryptedInput(
  await token.getAddress(),
  bob.address
);
input.add32(30);
const encrypted = await input.encrypt();

await token.connect(bob).transferFrom(
  alice.address,
  charlie.address,
  encrypted.handles[0],
  encrypted.inputProof
);
```

### Checking Balance

```typescript
// Get Alice's encrypted balance
const encryptedBalance = await token.balanceOf(alice.address);

// Decrypt (requires permission)
const balance = await fhevm.decrypt(
  await token.getAddress(),
  encryptedBalance
);
console.log('Alice balance:', balance);
```

## Privacy Features

### Hidden Balances

```solidity
mapping(address => euint32) private balances;
```

No one can see account balances without decryption permission.

### Hidden Transfer Amounts

```solidity
emit Transfer(from, to);  // No amount in event!
```

Transfer events don't reveal amounts.

### Hidden Allowances

```solidity
mapping(address => mapping(address => euint32)) private allowances;
```

Approval amounts are encrypted.

## Use Cases

- **Private DeFi** - Trade without revealing positions
- **Payroll** - Pay salaries privately
- **Confidential Voting** - Token-weighted voting
- **Private Fundraising** - Confidential token sales

## Limitations

### No Balance Checks

```solidity
// Can't check: if (balance >= amount)
// Must rely on FHE.sub() reverting on underflow
balances[msg.sender] = FHE.sub(balances[msg.sender], amount);
```

### Gas Costs

FHE operations are expensive:
- Transfer: ~200,000 gas
- Approve: ~100,000 gas
- TransferFrom: ~300,000 gas

### Total Supply

Total supply is encrypted - can't be publicly verified.

## Advanced Features

### Conditional Transfers

```solidity
function conditionalTransfer(
    address to,
    externalEuint32 amount,
    externalEuint32 condition,
    bytes calldata proofAmount,
    bytes calldata proofCond
) public {
    euint32 transferAmount = FHE.fromExternal(amount, proofAmount);
    euint32 condValue = FHE.fromExternal(condition, proofCond);

    ebool shouldTransfer = FHE.eq(condValue, FHE.asEuint32(1));
    euint32 actualAmount = FHE.select(shouldTransfer, transferAmount, FHE.asEuint32(0));

    balances[msg.sender] = FHE.sub(balances[msg.sender], actualAmount);
    balances[to] = FHE.add(balances[to], actualAmount);

    // Update permissions...
}
```

### Batch Transfers

```solidity
function batchTransfer(
    address[] calldata recipients,
    externalEuint32[] calldata amounts,
    bytes[] calldata proofs
) public {
    for (uint i = 0; i < recipients.length; i++) {
        euint32 amount = FHE.fromExternal(amounts[i], proofs[i]);
        balances[msg.sender] = FHE.sub(balances[msg.sender], amount);
        balances[recipients[i]] = FHE.add(balances[recipients[i]], amount);

        // Update permissions...
        emit Transfer(msg.sender, recipients[i]);
    }
}
```

## Testing

```typescript
describe('ConfidentialERC20', function () {
  it('Should transfer tokens confidentially', async function () {
    const token = await deploy('Private Token', 'PRIV', 18);

    // Mint to Alice
    await token.mint(alice.address, 1000);

    // Alice transfers to Bob
    const input = await fhevm.createEncryptedInput(
      await token.getAddress(),
      alice.address
    );
    input.add32(100);
    const encrypted = await input.encrypt();

    await token.connect(alice).transfer(
      bob.address,
      encrypted.handles[0],
      encrypted.inputProof
    );

    // Verify balances (requires decryption)
    const aliceBalance = await fhevm.decrypt(
      await token.getAddress(),
      await token.balanceOf(alice.address)
    );
    const bobBalance = await fhevm.decrypt(
      await token.getAddress(),
      await token.balanceOf(bob.address)
    );

    expect(aliceBalance).to.equal(900);
    expect(bobBalance).to.equal(100);
  });
});
```

## Next Steps

- [Best Practices](../best-practices/security.md) - Security guidelines
- [Gas Optimization](../best-practices/gas-optimization.md) - Reduce costs
