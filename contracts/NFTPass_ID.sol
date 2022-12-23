// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTPassID is ERC721, Ownable {    
    uint256 internal tokenId_;
    string internal baseURI_;

    mapping(address => uint256) private nftPassID;
    mapping(address => bool) public whitelistUsers;

    event SetBaseURI(string newBaseURI);
    event Mint(address to, uint256 tokenId);

    constructor(string memory _name, string memory _symbol, string memory _baseUri) ERC721(_name, _symbol) {
        baseURI_ = _baseUri;
    }

    function freeMint() external {
        require(whitelistUsers[msg.sender] == true, "NFTPassID: You are not on the whitelist");
        require(balanceOf(msg.sender) < 1, "NFTPassID: No more mint");
        tokenId_ += 1;
        nftPassID[msg.sender] = tokenId_;
        _mint(msg.sender, tokenId_);
        emit Mint(msg.sender, tokenId_);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        if (_exists(_tokenId)) {
            return
                bytes(baseURI_).length > 0
                    ? string(
                        abi.encodePacked(
                            baseURI_,
                            Strings.toString(_tokenId),
                            ".json"
                        )
                    )
                    : "";
        } else {
            return
                bytes(baseURI_).length > 0
                    ? string(
                        abi.encodePacked(
                            baseURI_,
                            "loyalty-wait.json"
                        )
                    )
                    : "";
        }
    }

    function getPassID(address _address) public view returns (uint256) {
        return nftPassID[_address];
    }

    function addWhitelist(address[] memory _users) external onlyOwner { 
        for(uint256 i = 0; i < _users.length; i++) {
            whitelistUsers[_users[i]] = true;
        }
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI_ = _newBaseURI;
        emit SetBaseURI(_newBaseURI);
    }

    function renounceOwnership() public override onlyOwner {}

    function transferFrom(address from, address to, uint256 tokenId) public override {}

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {}

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {}
}