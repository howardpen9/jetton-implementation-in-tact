import { buildOnchainMetadata } from "./utils/jetton-helpers";
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
    RemoteBlockchainStorage,
    wrapTonClient4ForRemote,
} from "@ton/sandbox";

import "@ton/test-utils";
// import "@ton-community/test-utils";

// import { Address, beginCell, fromNano, StateInit, toNano } from "ton-core";
import { Address, beginCell, fromNano, StateInit, toNano } from "@ton/core";
import { TonClient4 } from "@ton/ton";

import { SampleJetton, Mint, TokenTransfer } from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, TokenBurn } from "./output/SampleJetton_JettonDefaultWallet";

import {
    Asset,
    Factory,
    MAINNET_FACTORY_ADDR,
    PoolType,
    Vault,
    LiquidityDeposit,
    VaultJetton,
    JettonRoot,
    ReadinessStatus,
} from "@dedust/sdk";

const jettonParams = {
    name: "Best Practice",
    description: "This is description of Test tact jetton",
    symbol: "XXXE",
    image: "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
};
let content = buildOnchainMetadata(jettonParams);
let max_supply = toNano(1234766689011); // Set the specific total supply in nano

describe("contract", () => {
    let blockchain: Blockchain;
    let token: SandboxContract<SampleJetton>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;
    let deployer: SandboxContract<TreasuryContract>;
    // let player: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        // Create content Cell

        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");
        // player = await blockchain.treasury("player");

        token = blockchain.openContract(await SampleJetton.fromInit(deployer.address, content, max_supply));

        // Send Transaction
        const deployResult = await token.send(deployer.getSender(), { value: toNano("10") }, "Mint: 100");
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            deploy: true,
            success: true,
        });

        const playerWallet = await token.getGetWalletAddress(deployer.address);
        jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));
    });

    it("should deploy", async () => {
        // the check is done inside beforeEach, blockchain and token are ready to use
        // console.log((await token.getGetJettonData()).owner);
        // console.log((await token.getGetJettonData()).totalSupply);
        // console.log((await token.getGetJettonData()).max_supply);
        // console.log((await token.getGetJettonData()).content);
    });

    it("should mint successfully", async () => {
        const totalSupplyBefore = (await token.getGetJettonData()).total_supply;
        const mintAmount = toNano(100);
        const Mint: Mint = {
            $$type: "Mint",
            amount: mintAmount,
            receiver: deployer.address,
        };
        const mintResult = await token.send(deployer.getSender(), { value: toNano("10") }, Mint);
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            success: true,
        });
        printTransactionFees(mintResult.transactions);

        const totalSupplyAfter = (await token.getGetJettonData()).total_supply;
        expect(totalSupplyBefore + mintAmount).toEqual(totalSupplyAfter);

        const walletData = await jettonWallet.getGetWalletData();
        expect(walletData.owner).toEqualAddress(deployer.address);
        expect(walletData.balance).toBeGreaterThanOrEqual(mintAmount);
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
        await token.send(deployer.getSender(), { value: toNano("0.25") }, mintMessage);

        const senderWalletAddress = await token.getGetWalletAddress(sender.address);
        const senderWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(senderWalletAddress));

        // Transfer tokens from sender's wallet to receiver's wallet // 0xf8a7ea5
        const transferMessage: TokenTransfer = {
            $$type: "TokenTransfer",
            query_id: 0n,
            amount: transferAmount,
            sender: receiver.address,
            response_destination: sender.address,
            custom_payload: null,
            forward_ton_amount: toNano("0.1"),
            forward_payload: beginCell().storeUint(0, 1).storeUint(0, 32).endCell(),
        };
        const transferResult = await senderWallet.send(sender.getSender(), { value: toNano("0.5") }, transferMessage);
        expect(transferResult.transactions).toHaveTransaction({
            from: sender.address,
            to: senderWallet.address,
            success: true,
        });
        // printTransactionFees(transferResult.transactions);
        // prettyLogTransactions(transferResult.transactions);

        const receiverWalletAddress = await token.getGetWalletAddress(receiver.address);
        const receiverWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(receiverWalletAddress));

        const senderWalletDataAfterTransfer = await senderWallet.getGetWalletData();
        const receiverWalletDataAfterTransfer = await receiverWallet.getGetWalletData();

        expect(senderWalletDataAfterTransfer.balance).toEqual(initMintAmount - transferAmount); // check that the sender transferred the right amount of tokens
        expect(receiverWalletDataAfterTransfer.balance).toEqual(transferAmount); // check that the receiver received the right amount of tokens
        // const balance1 = (await receiverWallet.getGetWalletData()).balance;
        // console.log(fromNano(balance1));
    });

    it("Mint tokens then Burn tokens", async () => {
        // const sender = await blockchain.treasury("sender");
        const deployerWalletAddress = await token.getGetWalletAddress(deployer.address);
        const deployerWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(deployerWalletAddress));
        let deployerBalanceInit = (await deployerWallet.getGetWalletData()).balance;
        console.log("deployerBalanceInit = ", deployerBalanceInit);
        const initMintAmount = toNano(100);
        const mintMessage: Mint = {
            $$type: "Mint",
            amount: initMintAmount,
            receiver: deployer.address,
        };
        await token.send(deployer.getSender(), { value: toNano("10") }, mintMessage);
        let deployerBalance = (await deployerWallet.getGetWalletData()).balance;
        expect(deployerBalance).toEqual(deployerBalanceInit + initMintAmount);

        let burnAmount = toNano(10);
        const burnMessage: TokenBurn = {
            $$type: "TokenBurn",
            query_id: 0n,
            amount: burnAmount,
            response_destination: deployer.address,
            custom_payload: beginCell().endCell(),
        };

        const burnResult = await deployerWallet.send(deployer.getSender(), { value: toNano("10") }, burnMessage);
        let deployerBalanceAfterBurn = (await deployerWallet.getGetWalletData()).balance;
        expect(deployerBalanceAfterBurn).toEqual(deployerBalance - burnAmount);
    });

    it("Should return value", async () => {
        const player = await blockchain.treasury("player");
        const mintAmount = 1119000n;
        const Mint: Mint = {
            $$type: "Mint",
            amount: mintAmount,
            receiver: player.address,
        };
        await token.send(deployer.getSender(), { value: toNano("1") }, Mint);

        let totalSupply = (await token.getGetJettonData()).total_supply;
        const messateResult = await token.send(player.getSender(), { value: 10033460n }, Mint);
        expect(messateResult.transactions).toHaveTransaction({
            from: player.address,
            to: token.address,
        });
        let totalSupply_later = (await token.getGetJettonData()).total_supply;
        expect(totalSupply_later).toEqual(totalSupply);
        // printTransactionFees(messateResult.transactions);
        // prettyLogTransactions(messateResult.transactions);
    });

    // it("Convert Address Format", async () => {
    //     console.log("Example Address(Jetton Root Contract: " + token.address);
    //     console.log("Is Friendly Address: " + Address.isFriendly(token.address.toString()));

    //     const testAddr = Address.parse(token.address.toString());
    //     console.log("✓ Address: " + testAddr.toString({ bounceable: false }));
    //     console.log("✓ Address: " + testAddr.toString());
    //     console.log("✓ Address(urlSafe: true): " + testAddr.toString({ urlSafe: true }));
    //     console.log("✓ Address(urlSafe: false): " + testAddr.toString({ urlSafe: false }));
    //     console.log("✓ Raw Address: " + testAddr.toRawString());
    // });

    it("Onchian Testing", async () => {
        const blkch = await Blockchain.create({
            storage: new RemoteBlockchainStorage(
                wrapTonClient4ForRemote(
                    new TonClient4({
                        endpoint: "https://mainnet-v4.tonhubapi.com",
                    })
                )
            ),
        });
        const player = await blkch.treasury("player");

        const jettonRoot = blkch.openContract(await SampleJetton.fromInit(player.address, content, max_supply));
        await jettonRoot.send(player.getSender(), { value: toNano("10") }, "Mint: 100");

        const tonAmount = toNano("0.1"); // 5 TON
        const scaleAmount = toNano("0.000000001"); // 10 SCALE

        const TON = Asset.native();
        const SCALE = Asset.jetton(jettonRoot.address);

        const assets: [Asset, Asset] = [TON, SCALE];
        const targetBalances: [bigint, bigint] = [tonAmount, scaleAmount];
        console.log("DeDust Factory Address: " + MAINNET_FACTORY_ADDR);

        // 0x21cfe02b / 567271467: Create Vault
        // https://docs.dedust.io/reference/tlb-schemes#message-create_vault
        const factory = blkch.openContract(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
        const Tx = await factory.sendCreateVault(player.getSender(), {
            asset: SCALE,
        });
        await printTransactionFees(await Tx.transactions);

        // ------------------------------------------------------------------------------------------------
        // (0x97d51f2f / 2547326767: Create a volatile pool)
        // https://docs.dedust.io/reference/tlb-schemes#message-create_volatile_pool
        const pool = blkch.openContract(await factory.getPool(PoolType.VOLATILE, [TON, SCALE]));

        const poolReadiness = await pool.getReadinessStatus();
        if (poolReadiness === ReadinessStatus.NOT_DEPLOYED) {
            const transferLiquidity = await factory.sendCreateVolatilePool(player.getSender(), {
                assets: [TON, SCALE],
            });
            await printTransactionFees(await transferLiquidity.transactions);
        }

        // ------------------------------------------------------------------------------------------------
        // 0xd55e4686, Deposit / Adding Liquidity: Deposit TON to Vault
        // https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity
        const tonVault = blkch.openContract(await factory.getNativeVault());
        console.log("Native Vault Address: " + tonVault.address);
        const tx = await tonVault.sendDepositLiquidity(player.getSender(), {
            poolType: PoolType.VOLATILE,
            assets,
            targetBalances,
            amount: tonAmount,
        });
        await printTransactionFees(await tx.transactions);

        // Deposit Jetton to Vault
        const scaleRoot = blkch.openContract(JettonRoot.createFromAddress(jettonRoot.address));
        const scaleWallet = blkch.openContract(await scaleRoot.getWallet(player.address));
        await jettonRoot.send(player.getSender(), { value: toNano("10") }, "Mint: 100");

        const jettonVault = blkch.openContract(await factory.getJettonVault(jettonRoot.address));
        const tx_jetton = await scaleWallet.sendTransfer(player.getSender(), toNano("0.5"), {
            amount: scaleAmount,
            destination: jettonVault.address,
            responseAddress: player.address,
            forwardAmount: toNano("0.4"),
            forwardPayload: VaultJetton.createDepositLiquidityPayload({
                poolType: PoolType.VOLATILE,
                assets,
                targetBalances,
            }),
        });
        console.log("Deposit Jetton To Vault: " + jettonVault.address);
        await printTransactionFees(await tx_jetton.transactions);
        // ------------------------------------------------------------------------------------------------
        console.log("Swap: ");
        if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {
            throw new Error("Pool (TON, Jetton) does not exist.");
        }
        // Check if vault exits:
        if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {
            throw new Error("Vault (TON) does not exist.");
        }

        // Swap TON to Jetton
        const amountIn = toNano("0.0001"); // 5 TON
        const swapTx_result = await tonVault.sendSwap(player.getSender(), {
            poolAddress: pool.address,
            amount: amountIn,
            gasAmount: toNano("0.25"),
        });
        await printTransactionFees(await swapTx_result.transactions);

        // Swap Jetton to TON
        const jettonAmountIn = toNano("0.00000001"); // 50 SCALE
        const swapJetton_result = await scaleWallet.sendTransfer(player.getSender(), toNano("0.3030303"), {
            amount: jettonAmountIn,
            destination: jettonVault.address,
            responseAddress: player.address, // return gas to user
            forwardAmount: toNano("0.25"),
            forwardPayload: VaultJetton.createSwapPayload({
                poolAddress: pool.address,
                swapParams: { recipientAddress: deployer.address },
            }),
        });
        await printTransactionFees(await swapJetton_result.transactions);

        // ------------------------------------------------------------------------------------------------
        // Remove Liquidity
        // https://docs.dedust.io/docs/liquidity-provisioning#withdraw-liquidity
        const lpWallet = blkch.openContract(await pool.getWallet(player.address));

        const removeTx_Result = await lpWallet.sendBurn(player.getSender(), toNano("10"), {
            amount: await lpWallet.getBalance(),
        });
        console.log("removeTx_Result: ");
        await printTransactionFees(await removeTx_Result.transactions);
        console.log("JettonWallet: " + scaleWallet.address);
        await prettyLogTransactions(await removeTx_Result.transactions);
    }, 10000);
});
