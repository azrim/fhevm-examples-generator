// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, inEuint8, inEuint16, inEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title Public Decrypt Multiple Values
 * @notice Demonstrates public decryption of multiple encrypted values
 */
contract PublicDecryptMultiple is ZamaEthereumConfig {
  struct EncryptedStats {
    euint8 strength;
    euint16 health;
    euint32 experience;
    bool initialized;
  }

  struct PublicStats {
    uint8 strength;
    uint16 health;
    uint32 experience;
    bool revealed;
  }

  mapping(address => EncryptedStats) private encryptedStats;
  mapping(address => PublicStats) public publicStats;

  event StatsSet(address indexed user);
  event StatsRevealed(address indexed user, uint8 strength, uint16 health, uint32 experience);

  /**
   * @notice Set encrypted stats
   */
  function setStats(
    inEuint8 calldata strength,
    inEuint16 calldata health,
    inEuint32 calldata experience,
    bytes calldata proofStr,
    bytes calldata proofHp,
    bytes calldata proofExp
  ) public {
    euint8 encStr = FHE.asEuint8(strength, proofStr);
    euint16 encHp = FHE.asEuint16(health, proofHp);
    euint32 encExp = FHE.asEuint32(experience, proofExp);

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
   * @notice Reveal all stats publicly
   */
  function revealStats() public {
    require(encryptedStats[msg.sender].initialized, 'Stats not set');

    EncryptedStats memory encStats = encryptedStats[msg.sender];

    uint8 str = FHE.decrypt(encStats.strength);
    uint16 hp = FHE.decrypt(encStats.health);
    uint32 exp = FHE.decrypt(encStats.experience);

    publicStats[msg.sender] = PublicStats({
      strength: str,
      health: hp,
      experience: exp,
      revealed: true
    });

    emit StatsRevealed(msg.sender, str, hp, exp);
  }

  /**
   * @notice Get public stats (anyone can view after reveal)
   */
  function getPublicStats(address user) public view returns (uint8, uint16, uint32, bool) {
    PublicStats memory stats = publicStats[user];
    return (stats.strength, stats.health, stats.experience, stats.revealed);
  }

  /**
   * @notice Calculate total power (publicly)
   */
  function calculatePower() public returns (uint32) {
    require(encryptedStats[msg.sender].initialized, 'Stats not set');

    EncryptedStats memory encStats = encryptedStats[msg.sender];

    uint8 str = FHE.decrypt(encStats.strength);
    uint16 hp = FHE.decrypt(encStats.health);
    uint32 exp = FHE.decrypt(encStats.experience);

    uint32 power = uint32(str) * 10 + uint32(hp) + exp / 100;

    publicStats[msg.sender] = PublicStats({
      strength: str,
      health: hp,
      experience: exp,
      revealed: true
    });

    emit StatsRevealed(msg.sender, str, hp, exp);

    return power;
  }
}
