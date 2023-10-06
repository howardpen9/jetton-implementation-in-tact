import { ContractSystem } from "@tact-lang/emulator";
import { SampleJetton, loadJettonData, Mint, TokenTransfer } from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet } from "./output/SampleJetton_JettonDefaultWallet";
import { buildOnchainMetadata } from "./utils/jetton-helpers";

import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { beginCell, contractAddress, fromNano, StateInit, toNano } from "ton-core";
import "@ton-community/test-utils";

//
// This version of test is based on "@ton-community/sandbox" package
//
describe("contract", () => {
    let blockchain: Blockchain;
    let token: SandboxContract<SampleJetton>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;
    let deployer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        // Create content Cell
        const jettonParams = {
            name: "Best Practice",
            description: "This is description of Test tact jetton",
            symbol: "XXX",
            image: "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
        };
        let content = buildOnchainMetadata(jettonParams);
        let max_supply = toNano(1234766689011); // Set the specific total supply in nano
        token = blockchain.openContract(await SampleJetton.fromInit(deployer.address, content, max_supply));

        // Send Transaction
        const deployResult = await token.send(deployer.getSender(), { value: toNano("10") }, "Mint: 100");
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            deploy: true,
            success: true,
        });
    });

    it("should deploy", async () => {
        // the check is done inside beforeEach, blockchain and token are ready to use
        // console.log((await token.getGetJettonData()).owner);
        // console.log((await token.getGetJettonData()).totalSupply);
        // console.log((await token.getGetJettonData()).max_supply);
        // console.log((await token.getGetJettonData()).content);
    });

    it("should mint successfully", async () => {
        const player = await blockchain.treasury("player");
        const totalSupplyBefore = (await token.getGetJettonData()).totalSupply;
        const mintAmount = toNano(100);
        const Mint: Mint = {
            $$type: "Mint",
            amount: mintAmount,
            receiver: player.address,
        };
        const mintResult = await token.send(deployer.getSender(), { value: toNano("10") }, Mint);
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            success: true,
        });

        const totalSupplyAfter = (await token.getGetJettonData()).totalSupply;
        expect(totalSupplyBefore + mintAmount).toEqual(totalSupplyAfter);

        const playerWallet = await token.getGetWalletAddress(player.address);
        jettonWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(playerWallet));
        const walletData = await jettonWallet.getGetWalletData();
        expect(walletData.owner).toEqualAddress(player.address);
        expect(walletData.balance).toEqual(mintAmount);
    });

    it("should transfer successfully", async () => {
        const sender = await blockchain.treasury("sender");
        const receiver = await blockchain.treasury("receiver");
        const initMintAmount = toNano(1000);
        const transferAmount = toNano(80);

        const mintMessage: Mint = {
            $$type: "Mint",
            amount: initMintAmount,
            receiver: sender.address,
        };
        await token.send(deployer.getSender(), { value: toNano("10") }, mintMessage);

        const senderWalletAddress = await token.getGetWalletAddress(sender.address);
        const senderWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(senderWalletAddress));

        // Transfer tokens from sender's wallet to receiver's wallet
        const transferMessage: TokenTransfer = {
            $$type: "TokenTransfer",
            queryId: 1n,
            amount: transferAmount,
            destination: receiver.address,
            response_destination: sender.address,
            custom_payload: null,
            forward_ton_amount: 1n,
            forward_payload: beginCell().endCell(),
        };
        const transferResult = await senderWallet.send(sender.getSender(), { value: toNano("10") }, transferMessage);
        console.log(transferResult.transactions);

        const receiverWalletAddress = await token.getGetWalletAddress(receiver.address);
        const receiverWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(receiverWalletAddress));

        const senderWalletDataAfterTransfer = await senderWallet.getGetWalletData();
        const receiverWalletDataAfterTransfer = await receiverWallet.getGetWalletData();

        expect(senderWalletDataAfterTransfer.balance).toEqual(initMintAmount - transferAmount); // check that the sender transferred the right amount of tokens
        expect(receiverWalletDataAfterTransfer.balance).toEqual(transferAmount); // check that the receiver received the right amount of tokens
        // const balance1 = (await receiverWallet.getGetWalletData()).balance;
        // console.log(fromNano(balance1));
    });

    // it("should deploy correctly", async () => {
    //     // Create ContractSystem and deploy contract
    //     let system = await ContractSystem.create();
    //     let owner = system.treasure("owner");
    //     let nonOwner = system.treasure("non-owner");
    //     let contract = system.open(await SampleTactContract.fromInit(owner.address));
    //     system.name(contract.address, "main");
    //     let track = system.track(contract);
    //     await contract.send(owner, { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
    //     await system.run();
    //     expect(track.collect()).toMatchInlineSnapshot(`
    //         [
    //           {
    //             "$seq": 0,
    //             "events": [
    //               {
    //                 "$type": "deploy",
    //               },
    //               {
    //                 "$type": "received",
    //                 "message": {
    //                   "body": {
    //                     "cell": "x{946A98B60000000000000000}",
    //                     "type": "cell",
    //                   },
    //                   "bounce": true,
    //                   "from": "@treasure(owner)",
    //                   "to": "@main",
    //                   "type": "internal",
    //                   "value": 1000000000n,
    //                 },
    //               },
    //               {
    //                 "$type": "processed",
    //                 "gasUsed": 8307n,
    //               },
    //               {
    //                 "$type": "sent",
    //                 "messages": [
    //                   {
    //                     "body": {
    //                       "cell": "x{AFF90F570000000000000000}",
    //                       "type": "cell",
    //                     },
    //                     "bounce": true,
    //                     "from": "@main",
    //                     "to": "@treasure(owner)",
    //                     "type": "internal",
    //                     "value": 990497000n,
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         ]
    //     `);

    //     // Check counter
    //     expect(await contract.getCounter()).toEqual(0n);

    //     // Increment counter
    //     await contract.send(owner, { value: toNano(1) }, "increment");
    //     await system.run();
    //     expect(track.collect()).toMatchInlineSnapshot(`
    //         [
    //           {
    //             "$seq": 1,
    //             "events": [
    //               {
    //                 "$type": "received",
    //                 "message": {
    //                   "body": {
    //                     "text": "increment",
    //                     "type": "text",
    //                   },
    //                   "bounce": true,
    //                   "from": "@treasure(owner)",
    //                   "to": "@main",
    //                   "type": "internal",
    //                   "value": 1000000000n,
    //                 },
    //               },
    //               {
    //                 "$type": "processed",
    //                 "gasUsed": 5495n,
    //               },
    //             ],
    //           },
    //         ]
    //     `);

    //     // Check counter
    //     expect(await contract.getCounter()).toEqual(1n);

    //     // Non-owner
    //     await contract.send(nonOwner, { value: toNano(1) }, "increment");
    //     await system.run();
    //     expect(track.collect()).toMatchInlineSnapshot(`
    //         [
    //           {
    //             "$seq": 2,
    //             "events": [
    //               {
    //                 "$type": "received",
    //                 "message": {
    //                   "body": {
    //                     "text": "increment",
    //                     "type": "text",
    //                   },
    //                   "bounce": true,
    //                   "from": "@treasure(non-owner)",
    //                   "to": "@main",
    //                   "type": "internal",
    //                   "value": 1000000000n,
    //                 },
    //               },
    //               {
    //                 "$type": "failed",
    //                 "errorCode": 4429,
    //                 "errorMessage": "Invalid sender",
    //               },
    //               {
    //                 "$type": "sent-bounced",
    //                 "message": {
    //                   "body": {
    //                     "cell": "x{FFFFFFFF00000000696E6372656D656E74}",
    //                     "type": "cell",
    //                   },
    //                   "bounce": false,
    //                   "from": "@main",
    //                   "to": "@treasure(non-owner)",
    //                   "type": "internal",
    //                   "value": 994873000n,
    //                 },
    //               },
    //             ],
    //           },
    //         ]
    //     `);
    // });
});
