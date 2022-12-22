//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

interface INFTBox {
    function buyBox(uint256 amount, uint256 typeBox) external payable;
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function whatTypeBox(uint256 _tokenId) external pure returns (uint256 typeBox);
    function balanceOf(address owner) external view returns (uint256 balance);
    function howManyBoxes(uint256 typeBox) external view returns (uint256 boxes);
}