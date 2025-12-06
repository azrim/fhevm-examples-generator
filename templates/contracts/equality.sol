// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Equality
 * @notice Demonstrates equality comparison operations on encrypted integers
 * @dev Shows FHE.eq, FHE.ne, FHE.select operations
 */
contract Equality is ZamaEthereumConfig {
    ebool private lastComparisonResult;

    /**
     * @notice Compare two encrypted numbers for equality
     * @param inputA First encrypted input
     * @param inputProofA Proof for first input
     * @param inputB Second encrypted input
     * @param inputProofB Proof for second input
     * @return Encrypted boolean result
     */
    function isEqual(
        externalEuint32 inputA,
        bytes calldata inputProofA,
        externalEuint32 inputB,
        bytes calldata inputProofB
    ) public returns (ebool) {
        euint32 valueA = FHE.fromExternal(inputA, inputProofA);
        euint32 valueB = FHE.fromExternal(inputB, inputProofB);
        lastComparisonResult = FHE.eq(valueA, valueB);
        FHE.allowThis(lastComparisonResult);
        FHE.allow(lastComparisonResult, msg.sender);
        return lastComparisonResult;
    }

    /**
     * @notice Compare two encrypted numbers for inequality
     * @param inputA First encrypted input
     * @param inputProofA Proof for first input
     * @param inputB Second encrypted input
     * @param inputProofB Proof for second input
     * @return Encrypted boolean result
     */
    function isNotEqual(
        externalEuint32 inputA,
        bytes calldata inputProofA,
        externalEuint32 inputB,
        bytes calldata inputProofB
    ) public returns (ebool) {
        euint32 valueA = FHE.fromExternal(inputA, inputProofA);
        euint32 valueB = FHE.fromExternal(inputB, inputProofB);
        lastComparisonResult = FHE.ne(valueA, valueB);
        FHE.allowThis(lastComparisonResult);
        FHE.allow(lastComparisonResult, msg.sender);
        return lastComparisonResult;
    }

    /**
     * @notice Select between two values based on encrypted condition
     * @param condition Encrypted boolean condition
     * @param inputTrue Value if condition is true
     * @param inputProofTrue Proof for true value
     * @param inputFalse Value if condition is false
     * @param inputProofFalse Proof for false value
     * @return Selected encrypted value
     */
    function selectValue(
        ebool condition,
        externalEuint32 inputTrue,
        bytes calldata inputProofTrue,
        externalEuint32 inputFalse,
        bytes calldata inputProofFalse
    ) public returns (euint32) {
        euint32 valueTrue = FHE.fromExternal(inputTrue, inputProofTrue);
        euint32 valueFalse = FHE.fromExternal(inputFalse, inputProofFalse);
        euint32 result = FHE.select(condition, valueTrue, valueFalse);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        return result;
    }

    /**
     * @notice Get the last comparison result
     * @return Encrypted boolean result
     */
    function getLastResult() public view returns (ebool) {
        return lastComparisonResult;
    }
}
