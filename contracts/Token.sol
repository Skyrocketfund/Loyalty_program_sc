// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function makeAirdropTokens(address[] memory _addresses, uint256 _amount) public onlyOwner {
        for (uint32 i = 0; i < _addresses.length; i++) {
            _transfer(msg.sender, _addresses[i], _amount);
        }
    }
}
