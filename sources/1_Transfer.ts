import { printSeparator } from "./utils/print";
import { buildOnchainMetadata } from "./utils/jetton-helpers";
import * as dotenv from "dotenv";

dotenv.config();
// ========================================
import { configJettonParams } from "./contract.config";
import { _ENDPOINT_MAINNET, _ENDPOINT_TESTNET } from "./utils/static";
import { Address } from "@ton/core";
import { beginCell, contractAddress, fromNano, internal, toNano, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { JettonMasterContract } from "./output/JettonTact_JettonMasterContract";
import { storeTokenTransfer } from "./output/JettonTact_JettonDefaultWallet";
// ========================================

// 🔴 Who will receive the transferred jetton
let newReceiverAddress = Address.parse(process.env.TRANSFER_RECEIVER_ADDRESS as string);

(async () => {
    const client4 = new TonClient4({
        endpoint: process.env._IS_TEST_ENV === "true" ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET,
    });

    console.info(" -----→ use " + process.env._IS_TEST_ENV === "true" ? "Testnet" : "Mainnet");
    let workchain = 0;

    // 🔴 Change to your own, by creating .env file!
    let senderMnemonics = (process.env.MNEMONICS_OWNER || "").toString();
    let senderKeyPair = await mnemonicToPrivateKey(senderMnemonics.split(" "));
    let senderSecretKey = senderKeyPair.secretKey;
    let senderTonWallet = WalletContractV4.create({
        workchain,
        publicKey: senderKeyPair.publicKey,
    });

    let senderTonWalletContract = client4.open(senderTonWallet);

    // Create content Cell
    let content = buildOnchainMetadata(configJettonParams);
    let maxSupply = toNano(123456766689011); // 🔴 Set the specific total supply in nano

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well.
    let owner = senderTonWalletContract.address;
    let init = await JettonMasterContract.init(owner, content, maxSupply);
    console.log("✨ " + owner + "'s JettonWallet ==> ");

    let jettonMasterWallet = contractAddress(workchain, init);
    let jettonMasterContract = JettonMasterContract.fromAddress(jettonMasterWallet);
    let jettonMasterContractOpened = client4.open(jettonMasterContract);
    let jettonWallet = await jettonMasterContractOpened.getGetWalletAddress(owner);

    // ✨Pack the forward message into a cell
    const forwardPayloadLeft = beginCell()
        .storeBit(0) // 🔴  whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
        .storeUint(0, 32)
        .storeBuffer(Buffer.from("Hello, GM -- Left.", "utf-8"))
        .endCell();

    // const forward_message_right = beginCell()
    //     .storeBit(1) // 🔴 whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
    //     .storeRef(beginCell().storeUint(0, 32).storeBuffer(Buffer.from("Hello, GM. -- Right", "utf-8")).endCell())
    //     .endCell();

    // ========================================
    let customPayload = beginCell().storeBit(1).storeUint(0, 32).storeStringTail("EEEEEE").endCell();
    let packed = beginCell()
        .store(
            storeTokenTransfer({
                $$type: "TokenTransfer",
                query_id: 0n,
                amount: toNano(100000000),
                destination: newReceiverAddress,
                response_destination: owner, // Original Owner, aka. First Minter's Jetton Wallet
                custom_payload: customPayload,
                forward_ton_amount: toNano("0.01"),
                forward_payload: forwardPayloadLeft,
            }),
        )
        .endCell();

    let deployAmount = toNano("0.6");
    let seqno: number = await senderTonWalletContract.getSeqno();
    let balance: bigint = await senderTonWalletContract.getBalance();
    // ========================================
    printSeparator();
    console.log("Current deployment senderTonWallet balance: ", fromNano(balance).toString(), "💎TON");
    console.log("\n🛠️ Calling To JettonWallet:\n" + jettonWallet + "\n");
    await senderTonWalletContract.sendTransfer({
        seqno,
        secretKey: senderSecretKey,
        messages: [
            internal({
                to: jettonWallet,
                value: deployAmount,
                init: {
                    code: init.code,
                    data: init.data,
                },
                bounce: true,
                body: packed,
            }),
        ],
    });
})();
