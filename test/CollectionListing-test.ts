import { ethers } from "hardhat"
import { Signer, Contract, ContractFactory, BigNumber } from "ethers"
import chai from "chai"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
const { expect } = chai

describe("CollectionListing", async function () {
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let author: SignerWithAddress;
    let collection: SignerWithAddress;
    let CollectionListing: ContractFactory;
    let collectionListing: Contract;

    this.beforeEach("Deploy contract", async function () {
        CollectionListing = await ethers.getContractFactory('CollectionListing');
        collectionListing = await CollectionListing.deploy();
        await collectionListing.deployed();
        [owner, user, author, collection] = await ethers.getSigners();
    });

    describe("setMarketplaceFee", async function () {
        it("setMarketplaceFee, not owner", async function () {
            await expect(collectionListing.connect(user).setMarketplaceFee(5))
            .to.be.revertedWith("Ownable: caller is not the owner")
        });

        it("setMarketplaceFee", async function () {
            expect(await collectionListing.marketplaceFee()).to.equal(0);
            await collectionListing.setMarketplaceFee(5);
            expect(await collectionListing.marketplaceFee()).to.equal(5);
        });
    });

    describe("setListingPrice", async function () {
        it("setListingPrice, not owner", async function () {
            await expect(collectionListing.connect(user).setListingPrice(100))
            .to.be.revertedWith("Ownable: caller is not the owner")
        });

        it("setListingPrice", async function () {
            expect(await collectionListing.listingPrice()).to.equal(0);
            await collectionListing.setListingPrice(100);
            expect(await collectionListing.listingPrice()).to.equal(100);
        });
    });

    describe("setUpdateInfoPrice", async function () {
        it("setUpdateInfoPrice, not owner", async function () {
            await expect(collectionListing.connect(user).setUpdateInfoPrice(10))
            .to.be.revertedWith("Ownable: caller is not the owner")
        });

        it("setUpdateInfoPrice", async function () {
            expect(await collectionListing.updateInfoPrice()).to.equal(0);
            await collectionListing.setUpdateInfoPrice(10);
            expect(await collectionListing.updateInfoPrice()).to.equal(10);
        });
    });

    describe("setMaxAuthorRoyalty", async function () {
        it("setMaxAuthorRoyalty, not owner", async function () {
            await expect(collectionListing.connect(user).setMaxAuthorRoyalty(100))
            .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setMaxAuthorRoyalty", async function () {
            expect(await collectionListing.maxAuthorRoyalty()).to.equal(1000);
            await collectionListing.setMaxAuthorRoyalty(100);
            expect(await collectionListing.maxAuthorRoyalty()).to.equal(100);
        });
    });

    describe("listCollection", async function () {
        this.beforeEach("setMaxAuthorRoyalty and setListingPrice", async function () {
            await collectionListing.setListingPrice(100);
        });

        it("listCollection, Less than listingPrice", async function () {
            await expect(collectionListing.listCollection("https://collection.com/", 100, user.address, collection.address, {value: 10}))
            .to.be.revertedWith("CollectionListing: Less than listingPrice");
        });

        it("listCollection, _authorRoyalty more than the maxAuthorRoyalty", async function () {
            await expect(collectionListing.listCollection("https://collection.com/", 1100, user.address, collection.address, {value: 100}))
            .to.be.revertedWith("CollectionListing: _authorRoyalty more than the maxAuthorRoyalty");
        });

        it("listCollection", async function () {
            await collectionListing.listCollection("https://collection.com/", 100, user.address, collection.address, {value: 100});
            expect(await collectionListing.lastCollectionId()).to.equal(1);
            const collections = await collectionListing.collection(1);
            expect(collections[0]).to.equal("https://collection.com/");
            expect(collections[1]).to.equal(100);
            expect(collections[2]).to.equal(user.address);
            expect(collections[3]).to.equal(collection.address);
        });
    });

    describe("setCollectionInfo", async function () {
        this.beforeEach("listCollection", async function () {
            await collectionListing.setListingPrice(100);
            await collectionListing.listCollection("https://collection.com/", 100, author.address, collection.address, {value: 100});
            expect(await collectionListing.lastCollectionId()).to.equal(1);
            await collectionListing.setUpdateInfoPrice(500);
        });

        it("setCollectionInfo, not onlyAuthorOrOwner", async function () {
            await expect(collectionListing.connect(user).setCollectionInfo(1, "https://collection.com/", 200, author.address, {value: 500}))
            .to.be.revertedWith("CollectionListing: Caller is not the author or owner");
        });

        it("CollectionListing: collection doesn't exist", async function () {
            await expect(collectionListing.setCollectionInfo(3, "https://collection.com/", 200, author.address, {value: 500}))
            .to.be.revertedWith("CollectionListing: collection doesn't exist");
        });

        it("CollectionListing: _authorRoyalty more than the maxAuthorRoyalty", async function () {
            await expect(collectionListing.setCollectionInfo(1, "https://collection.com/", 2000, author.address, {value: 500}))
            .to.be.revertedWith("CollectionListing: _authorRoyalty more than the maxAuthorRoyalty");
        });

        it("CollectionListing: Less than updateInfoPrice", async function () {
            await expect(collectionListing.setCollectionInfo(1, "https://collection.com/", 200, author.address, {value: 100}))
            .to.be.revertedWith("CollectionListing: Less than updateInfoPrice");
        });

        it("setCollectionInfo, owner", async function () {
            await collectionListing.setCollectionInfo(1, "https://collection1.com/", 200, user.address, {value: 500});
            const collections = await collectionListing.collection(1);
            expect(collections[0]).to.equal("https://collection1.com/");
            expect(collections[1]).to.equal(200);
            expect(collections[2]).to.equal(user.address);
        });

        it("setCollectionInfo, author", async function () {
            await collectionListing.connect(author).setCollectionInfo(1, "https://collection1.com/", 200, user.address, {value: 500});
            const collections = await collectionListing.collection(1);
            expect(collections[0]).to.equal("https://collection1.com/");
            expect(collections[1]).to.equal(200);
            expect(collections[2]).to.equal(user.address);
        });
    });

    describe("setCollectionListedStatus", async function () {
        beforeEach("listCollection", async function () {
            await collectionListing.setListingPrice(100);
            await collectionListing.listCollection("https://collection.com/", 100, author.address, collection.address, {value: 100});
            expect(await collectionListing.lastCollectionId()).to.equal(1);
        });

        it("setCollectionListedStatus, not onlyAuthorOrOwner", async function () {
            const collections = await collectionListing.collection(1);
            expect(collections[4]).to.equal(true);
            await expect(collectionListing.connect(user).setCollectionListedStatus(1, false))
            .to.be.revertedWith("CollectionListing: Caller is not the author or owner");
        });

        it("CollectionListing: collection doesn't exist", async function () {
            await expect(collectionListing.setCollectionListedStatus(3, false))
            .to.be.revertedWith("CollectionListing: collection doesn't exist");
        });

        it("setCollectionListedStatus, owner", async function () {
            let collections = await collectionListing.collection(1);
            expect(collections[4]).to.equal(true);
            await collectionListing.setCollectionListedStatus(1, false);
            collections = await collectionListing.collection(1);
            expect(collections[4]).to.equal(false);
        });

        it("setCollectionListedStatus, author", async function () {
            let collections = await collectionListing.collection(1);
            expect(collections[4]).to.equal(true);
            await collectionListing.connect(author).setCollectionListedStatus(1, false);
            collections = await collectionListing.collection(1);
            expect(collections[4]).to.equal(false);
        });
    });
});