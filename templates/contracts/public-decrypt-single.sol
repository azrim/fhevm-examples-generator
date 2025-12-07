// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title Public Decrypt Single Value
 * @notice Demonstrates marking a value for public decryption
 * @dev Uses FHE.makePubliclyDecryptable() to prepare values for KMS decryption
 */
contract PublicDecryptSingle is ZamaEthereumConfig {
  euint32 private encryptedScore;
  bool private isMarkedForDecryption;

  event ScoreSet(address indexed user);
  event MarkedForDecryption(address indexed user);

  /**
   * @notice Set encrypted score
   */
  function setScore(externalEuint32 score, bytes calldata inputProof) public {
    euint32 encScore = FHE.fromExternal(score, inputProof);
    FHE.allowThis(encScore);
    FHE.allow(encScore, msg.sender);

    encryptedScore = encScore;
    isMarkedForDecryption = false;
    emit ScoreSet(msg.sender);
  }

  /**
   * @notice Get encrypted score
   */
  function getEncryptedScore() public view returns (euint32) {
    return encryptedScore;
  }

  /**
   * @notice Mark score for public decryption
   * @dev After calling this, the KMS can decrypt the value off-chain
   */
  function markForPublicDecryption() public {
    FHE.makePubliclyDecryptable(encryptedScore);
    isMarkedForDecryption = true;
    emit MarkedForDecryption(msg.sender);
  }

  /**
   * @notice Check if value is marked for decryption
   */
  function isMarkedPublic() public view returns (bool) {
    return FHE.isPubliclyDecryptable(encryptedScore);
  }

  /**
   * @notice Get decryption status
   */
  function getDecryptionStatus() public view returns (bool) {
    return isMarkedForDecryption;
  }
}
