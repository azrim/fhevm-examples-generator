// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import 'fhevm/lib/TFHE.sol';

/*
e ConfidentialERC20
 * @notice A confidential ERC20 token implementation following ERC-7984 standard
 * @dev Demonstrates encrypted token balances and transfers using FHEVM
 */
contract ConfidentialERC20 {
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
    totalSupply = TFHE.asEuint32(0);
  }

  /**
   * @notice Mint new tokens to an address
   * @param to The recipient address
   * @param amount The amount to mint (plaintext for simplicity)
   */
  function mint(address to, uint32 amount) public {
    euint32 encryptedAmount = TFHE.asEuint32(amount);
    TFHE.allowThis(encryptedAmount);
    TFHE.allow(encryptedAmount, to);

    balances[to] = TFHE.add(balances[to], encryptedAmount);
    totalSupply = TFHE.add(totalSupply, encryptedAmount);

    emit Mint(to, amount);
  }

  /**
   * @notice Transfer encrypted tokens to another address
   * @param to The recipient address
   * @param encryptedAmount The encrypted amount to transfer
   * @param inputProof Proof that the encrypted value is valid
   */
  function transfer(
    address to,
    einput encryptedAmount,
    bytes calldata inputProof
  ) public returns (bool) {
    euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
    TFHE.allowThis(amount);

    // Check if sender has sufficient balance
    ebool hasSufficientBalance = TFHE.le(amount, balances[msg.sender]);
    require(TFHE.decrypt(hasSufficientBalance), 'Insufficient balance');

    // Perform transfer
    balances[msg.sender] = TFHE.sub(balances[msg.sender], amount);
    balances[to] = TFHE.add(balances[to], amount);

    // Grant permissions
    TFHE.allow(balances[msg.sender], msg.sender);
    TFHE.allow(balances[to], to);

    emit Transfer(msg.sender, to);
    return true;
  }

  /**
   * @notice Approve a spender to transfer tokens on your behalf
   * @param spender The address authorized to spend
   * @param encryptedAmount The encrypted amount to approve
   * @param inputProof Proof that the encrypted value is valid
   */
  function approve(
    address spender,
    einput encryptedAmount,
    bytes calldata inputProof
  ) public returns (bool) {
    euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
    TFHE.allowThis(amount);
    TFHE.allow(amount, spender);

    allowances[msg.sender][spender] = amount;

    emit Approval(msg.sender, spender);
    return true;
  }

  /**
   * @notice Transfer tokens from one address to another using allowance
   * @param from The address to transfer from
   * @param to The recipient address
   * @param encryptedAmount The encrypted amount to transfer
   * @param inputProof Proof that the encrypted value is valid
   */
  function transferFrom(
    address from,
    address to,
    einput encryptedAmount,
    bytes calldata inputProof
  ) public returns (bool) {
    euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
    TFHE.allowThis(amount);

    // Check allowance
    ebool hasAllowance = TFHE.le(amount, allowances[from][msg.sender]);
    require(TFHE.decrypt(hasAllowance), 'Insufficient allowance');

    // Check balance
    ebool hasSufficientBalance = TFHE.le(amount, balances[from]);
    require(TFHE.decrypt(hasSufficientBalance), 'Insufficient balance');

    // Perform transfer
    balances[from] = TFHE.sub(balances[from], amount);
    balances[to] = TFHE.add(balances[to], amount);
    allowances[from][msg.sender] = TFHE.sub(allowances[from][msg.sender], amount);

    // Grant permissions
    TFHE.allow(balances[from], from);
    TFHE.allow(balances[to], to);
    TFHE.allow(allowances[from][msg.sender], msg.sender);

    emit Transfer(from, to);
    return true;
  }

  /**
   * @notice Get the encrypted balance of an address
   * @param account The address to query
   * @return The encrypted balance
   */
  function balanceOf(address account) public view returns (euint32) {
    return balances[account];
  }

  /**
   * @notice Get the encrypted allowance for a spender
   * @param owner The token owner
   * @param spender The authorized spender
   * @return The encrypted allowance
   */
  function allowance(address owner, address spender) public view returns (euint32) {
    return allowances[owner][spender];
  }

  /**
   * @notice Get the encrypted total supply
   * @return The encrypted total supply
   */
  function getTotalSupply() public view returns (euint32) {
    return totalSupply;
  }
}
