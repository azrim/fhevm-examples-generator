// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, externalEuint8, externalEuint16, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title User Decrypt Multiple Values
 * @notice Demonstrates user-side decryption of multiple encrypted values
 */
contract UserDecryptMultiple is ZamaEthereumConfig {
  struct Profile {
    euint8 level;
    euint16 points;
    euint32 coins;
    bool initialized;
  }

  mapping(address => Profile) private profiles;

  event ProfileCreated(address indexed user);
  event ProfileUpdated(address indexed user);

  /**
   * @notice Create user profile with multiple encrypted values
   */
  function createProfile(
    externalEuint8 level,
    externalEuint16 points,
    externalEuint32 coins,
    bytes calldata inputProof
  ) public {
    euint8 encLevel = FHE.fromExternal(level, inputProof);
    euint16 encPoints = FHE.fromExternal(points, inputProof);
    euint32 encCoins = FHE.fromExternal(coins, inputProof);

    FHE.allowThis(encLevel);
    FHE.allowThis(encPoints);
    FHE.allowThis(encCoins);

    FHE.allow(encLevel, msg.sender);
    FHE.allow(encPoints, msg.sender);
    FHE.allow(encCoins, msg.sender);

    profiles[msg.sender] = Profile({
      level: encLevel,
      points: encPoints,
      coins: encCoins,
      initialized: true
    });

    emit ProfileCreated(msg.sender);
  }

  /**
   * @notice Get all profile values (user can decrypt all client-side)
   */
  function getProfile() public view returns (euint8, euint16, euint32) {
    require(profiles[msg.sender].initialized, 'Profile not found');
    Profile memory profile = profiles[msg.sender];
    return (profile.level, profile.points, profile.coins);
  }

  /**
   * @notice Level up (increment level)
   */
  function levelUp() public {
    require(profiles[msg.sender].initialized, 'Profile not found');

    euint8 newLevel = FHE.add(profiles[msg.sender].level, FHE.asEuint8(1));
    FHE.allowThis(newLevel);
    FHE.allow(newLevel, msg.sender);

    profiles[msg.sender].level = newLevel;
    emit ProfileUpdated(msg.sender);
  }

  /**
   * @notice Add points
   */
  function addPoints(externalEuint16 amount, bytes calldata inputProof) public {
    require(profiles[msg.sender].initialized, 'Profile not found');

    euint16 encAmount = FHE.fromExternal(amount, inputProof);
    FHE.allowThis(encAmount);

    euint16 newPoints = FHE.add(profiles[msg.sender].points, encAmount);
    FHE.allowThis(newPoints);
    FHE.allow(newPoints, msg.sender);

    profiles[msg.sender].points = newPoints;
    emit ProfileUpdated(msg.sender);
  }
}
