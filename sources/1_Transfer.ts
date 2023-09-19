import { Address, beginCell, contractAddress, toNano, TonClient4, internal, fromNano, WalletContractV4 } from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader, printSeparator } from "./utils/print";

import { buildOnchainMetadata } from "./utils/jetton-helpers";
import { mnemonicToPrivateKey } from "ton-crypto";

import { SampleJetton } from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";
import * as dotenv from "dotenv";
dotenv.config();

// Owner should usually be the deploying wallet's address.
let NewOnwer_Address = Address.parse("kQAV6bPBdrulUJxY9jADD1yqhmb29W6hLJCmELllZKiSCjKA"); // 🔴

(async () => {
    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    let mnemonics = (process.env.mnemonics || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0;
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let wallet_contract = client4.open(wallet);
    console.log("✨" + wallet_contract.address + "'s JettonWallet ==> ");

    // Create content Cell
    const jettonParams = {
        name: "XXX",
        description: "This is description of Test tact jetton",
        symbol: "EEE",
        image: "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
    };
    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano(1234766689011); // Set the specific total supply in nano

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well.
    let init = await SampleJetton.init(wallet_contract.address, content, max_supply);
    let jetton_masterWallet = contractAddress(workchain, init);

    let contract_dataFormat = SampleJetton.fromAddress(jetton_masterWallet);
    let contract = client4.open(contract_dataFormat);
    let jetton_wallet = await contract.getGetWalletAddress(wallet_contract.address);
    console.log("✨JettonWallet: " + jetton_wallet);

    // TEST ===============================================================
    let test_message = beginCell().storeStringRefTail("https://cdn.logo.com/hotlink-ok/logo-social.png").endCell();
    let string_test = beginCell().storeStringTail("EEEEEE 我我我").endCell();
    let packed = beginCell()
        .store(
            storeTokenTransfer({
                $$type: "TokenTransfer",
                queryId: 0n,
                amount: toNano(488484),
                destination: NewOnwer_Address,
                response_destination: wallet_contract.address, // Original Owner, aka. First Minter's Jetton Wallet
                custom_payload: test_message,
                forward_ton_amount: toNano("0.000000001"),
                forward_payload: string_test,
            })
        )
        .endCell();
    // ===============================================================
    let deployAmount = toNano("0.5");
    let seqno: number = await wallet_contract.getSeqno();
    let balance: bigint = await wallet_contract.getBalance();

    printSeparator();
    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON\n\n");
    console.log("\n🛠️ Calling To JettonWallet:\n" + jetton_wallet);
    await wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: jetton_wallet,
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
