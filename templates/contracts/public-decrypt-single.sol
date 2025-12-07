// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, inEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/lib/ZamaEthereumConfig.sol';

/**
 * @title Public Decrypt Single Value
 * @notice Demonstrates public decryption where the decrypted value becomes public on-chain
 * @dev Uses FHE.decrypt() to reveal encrypted values publicly
 */
contract PublicDecryptSingle is ZamaEthereumConfig {
  mapping(address => euint32) private encryptedScores;
  mapping(address => uint32) public publicScores;

  event ScoreSet(address indexed user);
  event ScoreRevealed(address indexed user, uint32 score);

  /**
   * @notice Set encrypted score
   */
  function setScore(inEuint32 calldata score, bytes calldata inputProof) public {
    euint32 encScore = FHE.asEuint32(score, inputProof);
    FHE.allowThis(encScore);
    FHE.allow(encScore, msg.sender);

    encryptedScores[msg.sender] = encScore;
    emit ScoreSet(msg.sender);
  }

  /**
   * @notice Get encrypted score
   */
  function getEncryptedScore() public view returns (euint32) {
    return encryptedScores[msg.sender];
  }

  /**
   * @notice Reveal score publicly (decrypt on-chain)
   * @dev Once revealed, the score becomes public and visible to everyone
   */
  function revealScore() public {
    euint32 encScore = encryptedScores[msg.sender];
    uint32 decryptedScore = FHE.decrypt(encScore);

    publicScores[msg.sender] = decryptedScore;
    emit ScoreRevealed(msg.sender, decryptedScore);
  }

  /**
   * @notice Get public score (anyone can view)
   */
  function getPublicScore(address user) public view returns (uint32) {
    return publicScores[user];
  }

  /**
   * @notice Check if score is above threshold (publicly)
   */
  function isScoreAbove(uint32 threshold) public returns (bool) {
    euint32 encScore = encryptedScores[msg.sender];
    uint32 decryptedScore = FHE.decrypt(encScore);

    publicScores[msg.sender] = decryptedScore;
    emit ScoreRevealed(msg.sender, decryptedScore);

    return decryptedScore > threshold;
  }
}
