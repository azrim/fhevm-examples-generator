// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title Public Decrypt Multiple Values
 * @notice Demonstrates marking multiple values for public decryption
 */
contract PublicDecryptMultiple is ZamaEthereumConfig {
  struct EncryptedStats {
    euint8 strength;
    euint16 health;
    euint32 experience;
    bool initialized;
  }

  mapping(address => EncryptedStats) private encryptedStats;
  mapping(address => bool) private markedForDecryption;

  event StatsSet(address indexed user);
  event MarkedForDecryption(address indexed user);

  /**
   * @notice Set encrypted stats
   */
  function setStats(
    externalEuint8 strength,
    externalEuint16 health,
    externalEuint32 experience,
    bytes calldata inputProof
  ) public {
    euint8 encStr = FHE.fromExternal(strength, inputProof);
    euint16 encHp = FHE.fromExternal(health, inputProof);
    euint32 encExp = FHE.fromExternal(experience, inputProof);

    FHE.allowThis(encStr);
    FHE.allowThis(encHp);
    FHE.allowThis(encExp);

    FHE.allow(encStr, msg.sender);
    FHE.allow(encHp, msg.sender);
    FHE.allow(encExp, msg.sender);

    encryptedStats[msg.sender] = EncryptedStats({
      strength: encStr,
      health: encHp,
      experience: encExp,
      initialized: true
    });

    markedForDecryption[msg.sender] = false;
    emit StatsSet(msg.sender);
  }

  /**
   * @notice Get encrypted stats
   */
  function getEncryptedStats() public view returns (euint8, euint16, euint32) {
    require(encryptedStats[msg.sender].initialized, 'Stats not set');
    EncryptedStats memory stats = encryptedStats[msg.sender];
    return (stats.strength, stats.health, stats.experience);
  }

  /**
   * @notice Mark all stats for public decryption
   * @dev After calling this, the KMS can decrypt all values off-chain
   */
  function markAllForPublicDecryption() public {
    require(encryptedStats[msg.sender].initialized, 'Stats not set');

    EncryptedStats memory stats = encryptedStats[msg.sender];

    FHE.makePubliclyDecryptable(stats.strength);
    FHE.makePubliclyDecryptable(stats.health);
    FHE.makePubliclyDecryptable(stats.experience);

    markedForDecryption[msg.sender] = true;
    emit MarkedForDecryption(msg.sender);
  }

  /**
   * @notice Check if stats are marked for decryption
   */
  function areStatsMarkedPublic() public view returns (bool, bool, bool) {
    require(encryptedStats[msg.sender].initialized, 'Stats not set');
    EncryptedStats memory stats = encryptedStats[msg.sender];

    return (
      FHE.isPubliclyDecryptable(stats.strength),
      FHE.isPubliclyDecryptable(stats.health),
      FHE.isPubliclyDecryptable(stats.experience)
    );
  }

  /**
   * @notice Get decryption status
   */
  function getDecryptionStatus(address user) public view returns (bool) {
    return markedForDecryption[user];
  }
}
