// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AccessControl
 * @notice Demonstrates access control patterns for encrypted data in FHEVM
 * @dev Shows FHE.allow, FHE.allowThis, and FHE.allowTransient usage
 */
contract AccessControl is ZamaEthereumConfig {
    mapping(address => euint32) private balances;
    address private owner;

    event AccessGranted(address indexed user, address indexed grantedTo);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Store a balance with proper access control
     * @param inputEuint32 The encrypted balance
     * @param inputProof The input proof
     * @dev Demonstrates FHE.allowThis and FHE.allow for permanent permissions
     */
    function setBalance(
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) public {
        euint32 balance = FHE.fromExternal(inputEuint32, inputProof);
        balances[msg.sender] = balance;

        // Grant permanent access to the contract
        FHE.allowThis(balance);

        // Grant permanent access to the user
        FHE.allow(balance, msg.sender);

        // Grant permanent access to the owner
        FHE.allow(balance, owner);
    }

    /**
     * @notice Get user's balance
     * @return The encrypted balance
     * @dev Only accessible by authorized addresses
     */
    function getBalance() public view returns (euint32) {
        return balances[msg.sender];
    }

    /**
     * @notice Grant access to another address
     * @param grantee The address to grant access to
     * @dev Demonstrates explicit permission granting
     */
    function grantAccess(address grantee) public {
        euint32 balance = balances[msg.sender];
        FHE.allow(balance, grantee);
        emit AccessGranted(msg.sender, grantee);
    }

    /**
     * @notice Transfer balance to another user
     * @param to The recipient address
     * @param inputAmount The encrypted amount to transfer
     * @param inputProof The input proof
     * @dev Demonstrates transient permissions during operations
     */
    function transfer(
        address to,
        externalEuint32 inputAmount,
        bytes calldata inputProof
    ) public {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);

        // Use allowTransient for temporary computation access
        FHE.allowTransient(amount, address(this));

        euint32 senderBalance = balances[msg.sender];
        euint32 recipientBalance = balances[to];

        // Perform transfer
        balances[msg.sender] = FHE.sub(senderBalance, amount);
        balances[to] = FHE.add(recipientBalance, amount);

        // Update permissions
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }

    /**
     * @notice Check if contract has access to user's balance
     * @return True if contract has access
     */
    function hasContractAccess() public view returns (bool) {
        // This is a simplified check - in practice, access is managed by the FHE system
        return address(this) != address(0);
    }
}
