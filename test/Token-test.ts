import { ethers, network } from "hardhat"
import { Signer, Contract, ContractFactory, BigNumber, providers, ContractTransaction } from "ethers"
import chai, { use } from "chai"
import { AddressZero } from "@ethersproject/constants"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import type { TransactionResponse, TransactionReceipt, Log } from "@ethersproject/abstract-provider"
import { assert } from "console"
import {
    Token,
    Token__factory
} from "../typechain-types"
import { it } from "mocha"

const { expect } = chai
const { formatUnits, parseUnits } = ethers.utils

function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function range(start: number, end?: number): number[] {
    if (end === undefined) {
        end = start
        start = 0
    }
    return Array.from({ length: end - start }, (_, i) => i + start)
}

async function skipTimeTo(timestamp: number) {
    await network.provider.send("evm_setNextBlockTimestamp", [timestamp])
    await network.provider.send("evm_mine")
}

function ether(eth: string) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

function wei(wei: string): string {
    let eth = ethers.utils.formatEther(wei)
    return eth;
}

async function getLatestBlockTimestamp() {
    return (await ethers.provider.getBlock("latest")).timestamp || 0
}

function getUsersAddresses(users: SignerWithAddress[]) : string[] {
    let usersAddresses: string[] = []
    for(let i = 0; i < users.length; i++) {
        usersAddresses.push(users[i].address);
    }
    return usersAddresses;
}

describe("Airdrop", async () => {
    let owner: SignerWithAddress;
    let notOwner: SignerWithAddress;
    let users: Array<SignerWithAddress>;
    let AirdropFactory: Token__factory;
    let airdrop: Token;

    beforeEach("Deploy the contract", async function () {
        [owner, notOwner, ...users] = await ethers.getSigners();

        AirdropFactory = new Token__factory(owner);
        airdrop = await AirdropFactory.deploy("ERC20", "ERC20");
        await airdrop.deployed();
    });

    it("airdrop to 1000 addresses", async function () {
        let airdropAddresses = getUsersAddresses(users.slice(0, 1000));
        await expect(airdrop.connect(notOwner).makeAirdrop(airdropAddresses, 100)).to.be.revertedWith("Ownable: caller is not the owner");
        expect(await airdrop.makeAirdrop(airdropAddresses, 100)).to.ok;
        for(let i = 0; i < airdropAddresses.length; i++) {
            expect(await airdrop.balanceOf(airdropAddresses[i])).to.equal(100);
        }
    });
});