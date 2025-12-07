// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, euint32, inEuint8, inEuint16, inEuint32} from '@fhevm/solidity/lib/FHE.sol';
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
    inEuint8 calldata level,
    inEuint16 calldata points,
    inEuint32 calldata coins,
    bytes calldata proofLevel,
    bytes calldata proofPoints,
    bytes calldata proofCoins
  ) public {
    euint8 encLevel = FHE.asEuint8(level, proofLevel);
    euint16 encPoints = FHE.asEuint16(points, proofPoints);
    euint32 encCoins = FHE.asEuint32(coins, proofCoins);

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
  function addPoints(inEuint16 calldata amount, bytes calldata inputProof) public {
    require(profiles[msg.sender].initialized, 'Profile not found');

    euint16 encAmount = FHE.asEuint16(amount, inputProof);
    FHE.allowThis(encAmount);

    euint16 newPoints = FHE.add(profiles[msg.sender].points, encAmount);
    FHE.allowThis(newPoints);
    FHE.allow(newPoints, msg.sender);

    profiles[msg.sender].points = newPoints;
    emit ProfileUpdated(msg.sender);
  }
}
