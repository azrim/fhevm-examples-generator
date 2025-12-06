// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title BasicCounter
 * @notice A simple counter contract using encrypted values
 * @dev Demonstrates basic FHEVM operations: encrypted storage and increment
 */
contract BasicCounter is ZamaEthereumConfig {
    euint32 private counter;

    /**
     * @notice Increment the counter by 1
     * @dev Uses FHE addition to increment encrypted counter
     */
    function increment() public {
        counter = FHE.add(counter, FHE.asEuint32(1));
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);
    }

    /**
     * @notice Get the encrypted counter value
     * @return The encrypted counter
     */
    function getCounter() public view returns (euint32) {
        return counter;
    }

    /**
     * @notice Increment counter by a specific encrypted amount
     * @param inputEuint32 Encrypted amount to add
     * @param inputProof Input proof for the encrypted value
     */
    function incrementBy(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) public {
        euint32 value = FHE.fromExternal(inputEuint32, inputProof);
        counter = FHE.add(counter, value);
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);
    }
}
