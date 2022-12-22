import {ethers, network} from "hardhat"
import {Signer, Contract, ContractFactory, BigNumber} from "ethers"
import chai from "chai"
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers"
import {
    NFT,
    NFT__factory,
    Token,
    Token__factory,
} from "../typechain-types";

const {expect} = chai

function ether(eth: string) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

async function getLatestBlockTimestamp() {
    return (await ethers.provider.getBlock("latest")).timestamp || 0
}

async function skipTimeTo(timestamp: number) {
    await network.provider.send("evm_setNextBlockTimestamp", [timestamp])
    await network.provider.send("evm_mine")
}

describe("NFT", async function () {
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let NFT: NFT__factory;
    let nft: NFT;
    let Token: Token__factory;
    let token: Token;
    let users: SignerWithAddress[];

    beforeEach("Deploy contract", async function () {
        [owner, user1, user2, ...users] = await ethers.getSigners();

        Token = new Token__factory(owner);
        token = await Token.deploy("ERC20", "ERC20");
        await token.deployed();

        NFT = new NFT__factory(owner);

        nft = await NFT.deploy("nft", "LP", "https://nft.com/", token.address);
        await nft.deployed();

        expect(await token.balanceOf(owner.address)).to.equal(ether("100"));
        // expect(await token.transfer(user1.address, ether("0.5"))).to.equal(ether("100"));

        expect(await token.approve(nft.address, ether("10"))).to.ok;
    });

    describe("Owner functions", async function () {
        beforeEach("setProductPrices", async function () {
            await expect(nft.connect(user1).setProductPrices([1, 2], [ether("1"), ether("2")])).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(nft.setProductPrices([1, 2, 3], [ether("1"), ether("2")])).to.be.revertedWith("NFT: Different size");
            expect(await nft.setProductPrices([1, 2], [ether("1"), ether("2")])).to.ok
                .to.emit(nft, 'SetProductPrices')
                .withArgs([1, 2], [ether("1"), ether("2")]);
            expect(await nft.getProductPrice(1)).to.equal(ether("1"));
            expect(await nft.getProductPrice(2)).to.equal(ether("2"));
        });

        it("setBaseURI/tokenURI", async function () {
            await expect(nft.connect(user1).buyNFT(user1.address, 1, ether("1"))).to.be.revertedWith("ERC20: insufficient allowance");
            await expect(nft.buyNFT(owner.address, 1, ether("2"))).to.be.revertedWith("NFT: Incorrect price");
            expect(await nft.buyNFT(owner.address, 1, ether("1"))).to.ok
                .to.emit(nft, 'Mint')
                .withArgs(owner.address, 1);
            expect(await nft.setBaseURI("https://nfts.com/")).to.ok
                .to.emit(nft, 'SetBaseURI')
                .withArgs("https://nfts.com/");
            expect(await nft.tokenURI(1)).to.equal("https://nfts.com/1.json");
            expect(await nft.setMainToken(token.address)).to.ok;
        });


        it("renounceOwnership", async function () {
            expect(await nft.owner()).to.equal(owner.address);
            expect(await nft.renounceOwnership()).to.ok;
            expect(await nft.owner()).to.equal(owner.address);
        })

        it("Not exists(_tokenId)", async function () {
            expect(await nft.tokenURI(3)).to.equal("https://nft.com/loyalty-wait.json");
        });
    });
});