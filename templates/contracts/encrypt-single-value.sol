// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptSingleValue
 * @notice Demonstrates encrypting a single value using FHEVM
 * @dev Shows how to accept and store encrypted input with proper permissions
 */
contract EncryptSingleValue is ZamaEthereumConfig {
    euint32 private encryptedValue;
    address private owner;

    event ValueEncrypted(address indexed user);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Store an encrypted value
     * @param inputEuint32 The encrypted input value
     * @param inputProof The input proof for verification
     * @dev Demonstrates proper input proof handling and permission management
     */
    function storeEncryptedValue(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) public {
        // Convert external encrypted input to internal format
        euint32 value = FHE.fromExternal(inputEuint32, inputProof);

        // Store the encrypted value
        encryptedValue = value;

        // Grant permissions
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedValue, owner);

        emit ValueEncrypted(msg.sender);
    }

    /**
     * @notice Get the stored encrypted value
     * @return The encrypted value
     * @dev Only accessible by authorized addresses
     */
    function getEncryptedValue() public view returns (euint32) {
        return encryptedValue;
    }

    /**
     * @notice Update the encrypted value by adding to it
     * @param inputEuint32 The encrypted amount to add
     * @param inputProof The input proof
     */
    function addToValue(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) public {
        euint32 amount = FHE.fromExternal(inputEuint32, inputProof);
        encryptedValue = FHE.add(encryptedValue, amount);
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedValue, owner);
    }
}
