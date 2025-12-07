// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title Encrypt Multiple Values
 * @notice Demonstrates encrypting and storing multiple values in one transaction
 */
contract EncryptMultipleValues is ZamaEthereumConfig {
  struct UserData {
    euint8 age;
    euint16 score;
    euint32 balance;
    bool initialized;
  }

  mapping(address => UserData) private userData;

  event DataStored(address indexed user);

  /**
   * @notice Store multiple encrypted values
   * @param age Encrypted age (0-255)
   * @param score Encrypted score (0-65535)
   * @param balance Encrypted balance
   * @param inputProof Proof for all encrypted inputs
   */
  function storeData(
    externalEuint8 age,
    externalEuint16 score,
    externalEuint32 balance,
    bytes calldata inputProof
  ) public {
    euint8 encAge = FHE.fromExternal(age, inputProof);
    euint16 encScore = FHE.fromExternal(score, inputProof);
    euint32 encBalance = FHE.fromExternal(balance, inputProof);

    FHE.allowThis(encAge);
    FHE.allowThis(encScore);
    FHE.allowThis(encBalance);

    FHE.allow(encAge, msg.sender);
    FHE.allow(encScore, msg.sender);
    FHE.allow(encBalance, msg.sender);

    userData[msg.sender] = UserData({
      age: encAge,
      score: encScore,
      balance: encBalance,
      initialized: true
    });

    emit DataStored(msg.sender);
  }

  /**
   * @notice Get all stored values
   */
  function getData() public view returns (euint8, euint16, euint32) {
    require(userData[msg.sender].initialized, 'No data stored');
    UserData memory data = userData[msg.sender];
    return (data.age, data.score, data.balance);
  }

  /**
   * @notice Update specific field
   */
  function updateBalance(externalEuint32 newBalance, bytes calldata inputProof) public {
    require(userData[msg.sender].initialized, 'No data stored');

    euint32 encBalance = FHE.fromExternal(newBalance, inputProof);
    FHE.allowThis(encBalance);
    FHE.allow(encBalance, msg.sender);

    userData[msg.sender].balance = encBalance;
    emit DataStored(msg.sender);
  }
}
