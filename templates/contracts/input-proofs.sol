// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from '@fhevm/solidity/lib/FHE.sol';
import {ZamaEthereumConfig} from '@fhevm/solidity/config/ZamaConfig.sol';

/**
 * @title InputProofs
 * @notice Demonstrates input proof handling and validation in FHEVM
 * @dev Shows why input proofs are needed and how to use them correctly
 */
contract InputProofs is ZamaEthereumConfig {
  euint32 private storedValue;

  event ValueStored(address indexed user);
  event ProofValidated(address indexed user, bool success);

  /**
   * @notice Store a value with proper input proof validation
   * @param inputEuint32 The encrypted input value
   * @param inputProof The cryptographic proof that the input is valid
   * @dev Input proofs ensure that encrypted values are properly formed
   */
  function storeWithProof(externalEuint32 inputEuint32, bytes calldata inputProof) public {
    // Convert external encrypted input with proof validation
    // This ensures the encrypted value is properly formed and authorized
    euint32 value = FHE.fromExternal(inputEuint32, inputProof);

    storedValue = value;
    FHE.allowThis(storedValue);
    FHE.allow(storedValue, msg.sender);

    emit ValueStored(msg.sender);
    emit ProofValidated(msg.sender, true);
  }

  /**
   * @notice Get the stored value
   * @return The encrypted stored value
   */
  function getValue() public view returns (euint32) {
    return storedValue;
  }

  /**
   * @notice Perform operation with multiple input proofs
   * @param inputA First encrypted value
   * @param proofA Proof for first value
   * @param inputB Second encrypted value
   * @param proofB Proof for second value
   * @return Sum of the two values
   */
  function addWithProofs(
    externalEuint32 inputA,
    bytes calldata proofA,
    externalEuint32 inputB,
    bytes calldata proofB
  ) public returns (euint32) {
    euint32 valueA = FHE.fromExternal(inputA, proofA);
    euint32 valueB = FHE.fromExternal(inputB, proofB);

    euint32 result = FHE.add(valueA, valueB);
    FHE.allowThis(result);
    FHE.allow(result, msg.sender);

    return result;
  }
}
