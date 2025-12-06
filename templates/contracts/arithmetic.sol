// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Arithmetic
 * @notice Demonstrates arithmetic operations on encrypted integers
 * @dev Shows add, subtract, multiply operations with euint32
 */
contract Arithmetic is ZamaEthereumConfig {
    euint32 private result;

    /**
     * @notice Add two encrypted numbers
     * @param inputA First encrypted input
     * @param inputProofA Proof for first input
     * @param inputB Second encrypted input
     * @param inputProofB Proof for second input
     * @return Encrypted sum
     */
    function add(
        externalEuint32 inputA,
        bytes calldata inputProofA,
        externalEuint32 inputB,
        bytes calldata inputProofB
    ) public returns (euint32) {
        euint32 valueA = FHE.fromExternal(inputA, inputProofA);
        euint32 valueB = FHE.fromExternal(inputB, inputProofB);
        result = FHE.add(valueA, valueB);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        return result;
    }

    /**
     * @notice Subtract two encrypted numbers
     * @param inputA First encrypted input (minuend)
     * @param inputProofA Proof for first input
     * @param inputB Second encrypted input (subtrahend)
     * @param inputProofB Proof for second input
     * @return Encrypted difference
     */
    function subtract(
        externalEuint32 inputA,
        bytes calldata inputProofA,
        externalEuint32 inputB,
        bytes calldata inputProofB
    ) public returns (euint32) {
        euint32 valueA = FHE.fromExternal(inputA, inputProofA);
        euint32 valueB = FHE.fromExternal(inputB, inputProofB);
        result = FHE.sub(valueA, valueB);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        return result;
    }

    /**
     * @notice Multiply two encrypted numbers
     * @param inputA First encrypted input
     * @param inputProofA Proof for first input
     * @param inputB Second encrypted input
     * @param inputProofB Proof for second input
     * @return Encrypted product
     */
    function multiply(
        externalEuint32 inputA,
        bytes calldata inputProofA,
        externalEuint32 inputB,
        bytes calldata inputProofB
    ) public returns (euint32) {
        euint32 valueA = FHE.fromExternal(inputA, inputProofA);
        euint32 valueB = FHE.fromExternal(inputB, inputProofB);
        result = FHE.mul(valueA, valueB);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        return result;
    }

    /**
     * @notice Get the stored result
     * @return Encrypted result
     */
    function getResult() public view returns (euint32) {
        return result;
    }
}
