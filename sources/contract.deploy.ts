import { buildOnchainMetadata } from "./utils/jetton-helpers";

import { printSeparator } from "./utils/print";
import * as dotenv from "dotenv";
import { configJettonParams } from "./contract.config";
import { _ENDPOINT_MAINNET, _ENDPOINT_TESTNET } from "./utils/static";
import { TonClient4, WalletContractV4, beginCell, contractAddress, toNano, internal, fromNano } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { JettonMasterContract } from "./output/JettonTact_JettonMasterContract";
import { storeMint } from "./output/JettonTact_JettonDefaultWallet";

dotenv.config();

(async () => {
    const client4 = new TonClient4({
        endpoint: process.env._IS_TEST_ENV === "true" ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET,
    });
    console.info("  ###### Using ", process.env._IS_TEST_ENV === "true" ? "Testnet" : "Mainnet");
    let workchain = 0; //we are working in basechain.

    // 🔴 Change to your own, by creating .env file!
    let ownerMnemonics = (process.env.MNEMONICS_OWNER || "").toString();
    let ownerKeyPair = await mnemonicToPrivateKey(ownerMnemonics.split(" "));
    let ownerSecretKey = ownerKeyPair.secretKey;
    let ownerWalletContract = WalletContractV4.create({ workchain, publicKey: ownerKeyPair.publicKey });
    let ownerWalletContractOpened = client4.open(ownerWalletContract);

    let ownerAddress = ownerWalletContractOpened.address;
    console.log("Owner Wallet Address: " + ownerAddress);

    // Create content Cell
    let content = buildOnchainMetadata(configJettonParams);
    let maxSupply = toNano(123456766689011); // 🔴 Set the specific total supply in nano

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well
    let init = await JettonMasterContract.init(ownerAddress, content, maxSupply);
    let jettonMasterAddress = contractAddress(workchain, init);

    // send a message on new address contract to deploy it
    let seqno: number = await ownerWalletContractOpened.getSeqno();
    console.log("🛠️Preparing new outgoing massage from deployment wallet. \n" + ownerAddress);
    console.log("Seqno: ", seqno + "\n");
    printSeparator();

    // Get deployment wallet balance
    let balance: bigint = await ownerWalletContractOpened.getBalance();
    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON");
    let supply = toNano(1000000); // 🔴 Specify total supply in nano
    console.log("Minting:: ", fromNano(supply));
    printSeparator();

    let packedMsg = beginCell()
        .store(
            storeMint({
                $$type: "Mint",
                amount: supply,
                receiver: ownerAddress,
            }),
        )
        .endCell();

    // sendTransfer is an external msg include an internal msg which op is Mint
    await ownerWalletContractOpened.sendTransfer({
        seqno,
        secretKey: ownerSecretKey,
        messages: [
            internal({
                to: jettonMasterAddress,
                value: toNano("0.15"), // this value not include the external msg fee!!
                init: {
                    code: init.code,
                    data: init.data,
                },
                body: packedMsg,
            }),
        ],
    });
    console.log("====== Deployment message sent to =======\n", jettonMasterAddress);
})();
