// contracts/Excalibur.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Excalibur Token
 * @dev This is Governance Token of Labrado
 * @author Labrado
 */
contract Excalibur is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 10 * 10**(9 + 18); // 10 billion tokens

    constructor() ERC20("EXCALIBUR", "EXCA") {}

    /**
     * @dev Mint new token
     * - Can only be called by onlyOwner
     * @param _to Address recipient
     * @param _amount Token create new
     **/
    function mint(address _to, uint256 _amount) public onlyOwner {
        require(
            totalSupply() + _amount <= MAX_SUPPLY,
            "EXCA: Max supply exceeded"
        );
        _mint(_to, _amount);
    }

    /**
     * @dev Transfer token to multiple recipients in a transaction
     * - Can called by everyone external contract
     * @param _recipients Is array address of recipients
     * @param _amounts Is array amount of recipients
     **/
    function transferBatch(
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(
            _recipients.length == _amounts.length,
            "EXCA: _recipients and _amounts must be equal"
        );
        uint256 total = 0;
        for (uint256 i = 0; i < _recipients.length; i++) total += _amounts[i];
        require(
            this.transferFrom(msg.sender, address(this), total),
            "EXCA: transfer from sender to contract failed"
        );
        for (uint256 i = 0; i < _recipients.length; i++)
            require(
                this.transfer(_recipients[i], _amounts[i]),
                "EXCA: transfer from contract to recipient failed"
            );
    }
}
