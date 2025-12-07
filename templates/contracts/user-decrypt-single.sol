// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title User Decrypt Single Value
 * @notice Demonstrates user-side decryption of a single encrypted value
 * @dev Users can decrypt values they have permission for using the FHEVM SDK
 */
contract UserDecryptSingle is ZamaEthereumConfig {
  mapping(address => euint32) private balances;

  event BalanceSet(address indexed user);
  event BalanceUpdated(address indexed user);

  /**
   * @notice Set encrypted balance
   * @param amount Encrypted amount
   * @param inputProof Proof for the encrypted input
   */
  function setBalance(externalEuint32 amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.fromExternal(amount, inputProof);
    FHE.allowThis(encAmount);
    FHE.allow(encAmount, msg.sender);

    balances[msg.sender] = encAmount;
    emit BalanceSet(msg.sender);
  }

  /**
   * @notice Get encrypted balance
   * @return Encrypted balance (user can decrypt client-side)
   * @dev User must have permission to decrypt this value
   */
  function getBalance() public view returns (euint32) {
    return balances[msg.sender];
  }

  /**
   * @notice Add to balance
   * @param amount Amount to add
   * @param inputProof Proof for amount
   */
  function addToBalance(externalEuint32 amount, bytes calldata inputProof) public {
    euint32 encAmount = FHE.fromExternal(amount, inputProof);
    FHE.allowThis(encAmount);

    euint32 newBalance = FHE.add(balances[msg.sender], encAmount);
    FHE.allowThis(newBalance);
    FHE.allow(newBalance, msg.sender);

    balances[msg.sender] = newBalance;
    emit BalanceUpdated(msg.sender);
  }

  /**
   * @notice Grant permission to another user to view balance
   * @param user Address to grant permission to
   */
  function grantPermission(address user) public {
    FHE.allow(balances[msg.sender], user);
  }
}
