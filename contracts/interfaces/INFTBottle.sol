//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

interface INFTBottle {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function balanceOf(address owner) external view returns (uint256 balance);
    function whatTypeBottle(uint256 _tokenId) external pure returns (uint256 typeBottle);
    function transferFrom(address from, address to,uint256 tokenId) external;
}