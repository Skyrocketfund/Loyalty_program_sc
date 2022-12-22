// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollectionListing is Ownable {
    uint256 public lastCollectionId;
    uint256 public listingPrice;
    uint256 public updateInfoPrice;
    uint256 public marketplaceFee;
    uint256 public maxAuthorRoyalty = 1000;

    mapping (uint256 => CollectionInfo) public collection;

    struct CollectionInfo {
        string contractURI;
        uint256 authorRoyalty;
        address authorAddress;
        IERC721 collectionContract;
        bool listed;
    }

    modifier onlyAuthorOrOwner(uint256 _id) {
        require(collection[_id].authorAddress == _msgSender() || owner() == _msgSender(), "CollectionListing: Caller is not the author or owner");
        _;
    }

    event SetMarketplaceFee(uint256 marketplaceFee);
    event SetListingPrice(uint256 listingPrice);
    event SetUpdateInfoPrice(uint256 updateInfoPrice);
    event ListCollection(string contractURI, uint256 authorRoyalty, address authorAddress, address collectionContractAddress);
    event SetCollectionInfo(string contractURI, uint256 authorRoyalty, address authorAddress);
    event SetCollectionListedStatus(bool listed);
    event SetMaxAuthorRoyalty(uint256 maxAuthorRoyalty);

    function setMarketplaceFee(uint256 _marketplaceFee) external onlyOwner {
        marketplaceFee = _marketplaceFee;

        emit SetMarketplaceFee(_marketplaceFee);
    }

    function setListingPrice(uint256 _listingPrice) external onlyOwner {
        listingPrice = _listingPrice;

        emit SetListingPrice(_listingPrice);
    }

    function setUpdateInfoPrice(uint256 _updateInfoPrice) external onlyOwner {
        updateInfoPrice = _updateInfoPrice;

        emit SetUpdateInfoPrice(_updateInfoPrice);
    }

    function setMaxAuthorRoyalty(uint256 _maxAuthorRoyalty) external onlyOwner {
        maxAuthorRoyalty = _maxAuthorRoyalty;

        emit SetMaxAuthorRoyalty(_maxAuthorRoyalty);
    }

    function listCollection(
        string memory _contractURI,
        uint256 _authorRoyalty,
        address _authorAddress,
        address _collectionContractAddress
    ) external payable {
        require(_authorRoyalty <= maxAuthorRoyalty, "CollectionListing: _authorRoyalty more than the maxAuthorRoyalty");
        require(msg.value >= listingPrice, "CollectionListing: Less than listingPrice");
        uint256 _collectionId = lastCollectionId + 1;
        lastCollectionId = _collectionId;

        collection[_collectionId] = CollectionInfo(_contractURI, _authorRoyalty, _authorAddress, IERC721(_collectionContractAddress), true);

        emit ListCollection(_contractURI, _authorRoyalty, _authorAddress, _collectionContractAddress);
    }

    function setCollectionInfo(
        uint256 _id,
        string memory _contractURI,
        uint256 _authorRoyalty,
        address _authorAddress
    ) external payable onlyAuthorOrOwner(_id) {
        require(_id <= lastCollectionId, "CollectionListing: collection doesn't exist");
        require(_authorRoyalty <= maxAuthorRoyalty, "CollectionListing: _authorRoyalty more than the maxAuthorRoyalty");
        require(msg.value >= updateInfoPrice, "CollectionListing: Less than updateInfoPrice");
        collection[_id].contractURI = _contractURI;
        collection[_id].authorRoyalty = _authorRoyalty;
        collection[_id].authorAddress = _authorAddress;

        emit SetCollectionInfo(_contractURI, _authorRoyalty, _authorAddress);
    }

    function setCollectionListedStatus(uint256 _id, bool _listed) external onlyAuthorOrOwner(_id) {
        require(_id <= lastCollectionId, "CollectionListing: collection doesn't exist");
        collection[_id].listed = _listed;

        emit SetCollectionListedStatus(_listed);
    }
}