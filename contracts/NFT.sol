// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./library/Withdrawable.sol";

contract NFT is ERC721Enumerable, Ownable, Withdrawable {
    using SafeERC20 for IERC20;
    
    IERC20 public mainToken;
    uint256 internal tokenId_;
    string internal baseURI_;

    mapping(uint256 => uint256) private productPrices;

    event SetBaseURI(string newBaseURI);
    event SetMainToken(IERC20 mainToken);
    event Mint(address to, uint256 tokenId);
    event SetProductPrices(uint256[] _productIds, uint256[] _prices);

    constructor(string memory _name, string memory _symbol, string memory _baseUri, IERC20 _mainToken) ERC721(_name, _symbol) {
        baseURI_ = _baseUri;
        mainToken = _mainToken;
    }

    function buyNFT(address _to, uint256 _productId, uint256 _price) external {
        require(productPrices[_productId] == _price, "NFT: Incorrect price");
        mainToken.transferFrom(msg.sender, address(this), _price);
        _mintTokens(_to, 1);
    }

    function _mintTokens(address _to, uint256 _amountNFT) private {
        uint256 _lastTokenId = tokenId_;
        for (uint256 _index = 0; _index < _amountNFT; _index++) {
            _lastTokenId += 1;
            _mint(_to, _lastTokenId);
            emit Mint(_to, _lastTokenId);
        }
        tokenId_ += _amountNFT;
    }

    function getIdNFT(address _owner) public view returns (uint256[] memory) {
        uint256 _size = balanceOf(_owner);
        uint256[] memory _ids = new uint256[](_size);
        for (uint256 i = 0; i < _size; i++) {
            _ids[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return _ids;
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

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI_ = _newBaseURI;
        emit SetBaseURI(_newBaseURI);
    }

    function setMainToken(IERC20 _mainToken) external onlyOwner {
        mainToken = _mainToken;
        emit SetMainToken(_mainToken);
    }

    function setProductPrices(uint256[] memory _productIds, uint256[] memory _prices) external onlyOwner {
        require(_productIds.length == _prices.length, "NFT: Different size");
        for(uint256 i = 0; i < _prices.length; i++) {
            productPrices[_productIds[i]] = _prices[i];
        }
        emit SetProductPrices(_productIds, _prices);
    }

    function getProductPrice(uint256 _productId) public view returns (uint256) {
        return productPrices[_productId];
    }

    function renounceOwnership() public override onlyOwner {}
}