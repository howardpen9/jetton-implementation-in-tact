import {
    WalletContractV4,
    beginCell,
    Address,
    contractAddress,
    ContractProvider,
    TonClient4,
    TonClient,
    fromNano,
    toNano,
    Cell,
    BitString,
    Slice,
} from "ton";
import { printSeparator } from "./utils/print";

// Contract Abi //
import { buildOnchainMetadata } from "./utils/jetton-helpers";
import { mnemonicToPrivateKey } from "ton-crypto";

import { SampleJetton, loadTokenTransfer } from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet } from "./output/SampleJetton_JettonDefaultWallet";

(async () => {
    // //create client for testnet sandboxv4 API - alternative endpoint
    // const client = new TonClient4({
    //     endpoint: "https://sandbox-v4.tonhubapi.com",
    // });
    // const mnemonics = "YOUR OWN mnemonics";
    // let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    // let secretKey = keyPair.secretKey;
    // let workchain = 0; //we are working in basechain.
    // let deploy_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    // let deploy_wallet_contract = client.open(deploy_wallet);
    // // Get deployment wallet balance
    // // let balance: bigint = await deploy_address.getBalance();
    // const jettonParams = {
    //     name: "Test 123 Best Practice",
    //     description: "This is description of Test tact jetton",
    //     symbol: "PPPPPPPP",
    //     image: "https://cdn.logo.com/hotlink-ok/logo-social.png",
    // };
    // let max_supply = toNano(1234567666666689011); // Set the specific total supply in nano
    // // Create content Cell
    // let content = buildOnchainMetadata(jettonParams);
    // let init = await SampleJetton.init(deploy_wallet_contract.address, content, max_supply);
    // let jetton_minter_contract_address = contractAddress(workchain, init);
    // console.log("Jetton Master: " + jetton_minter_contract_address);
    // let contract_ddd = await client.open(SampleJetton.fromAddress(jetton_minter_contract_address));
    // let jetton_wallet = await contract_ddd.getGetWalletAddress(deploy_wallet_contract.address);
    // let contract_dataFormat = JettonDefaultWallet.fromAddress(jetton_wallet);
    // let contract = client.open(contract_dataFormat);
    // console.log("Deployer's JettonWallet: " + contract.address);
    // let jettonWalletBalance = await (await contract.getGetWalletData()).balance;
    // let owner_of_wallet = await (await contract.getGetWalletData()).owner;
    // console.log("JettonWallet Balance: " + jettonWalletBalance);
    // console.log("JettonWallet Owner: \n" + owner_of_wallet);
    // TODO:
    // // loadOwnershipAssigned => msg.forwardload
    // let aa = loadTransferEvent(src.asSlice());
    // console.log("Mint MemberID: " + aa.item_index + ", by " + aa.minter);

    const hexString = Cell.fromBase64("b5ee9c7201010101000700000a3132333435");
    let aa = loadTokenTransfer(hexString.asSlice());
    // const uint8ArrayData = hexToUint8Array(hexString);
    console.log(aa.forward_payload);
})();

function hexToUint8Array(hex: string): Uint8Array {
    const length = hex.length / 2;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = parseInt(hex.substr(i * 2, 2), 16);
    }

    return uint8Array;
}
