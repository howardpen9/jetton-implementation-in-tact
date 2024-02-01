import { printSeparator } from "./utils/print";

// Contract Abi //
import { buildOnchainMetadata } from "./utils/jetton-helpers";

import { contractAddress, toNano, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { _ENDPOINT_MAINNET, _ENDPOINT_TESTNET } from "./utils/static";

(async () => {
    // const client = new TonClient4({
    //     endpoint: process.env._IS_TEST_ENV === "true" ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET,
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
    // let init = await JettonMasterContract.init(deploy_wallet_contract.address, content, max_supply);
    // let jetton_minter_contract_address = contractAddress(workchain, init);
    // console.log("Jetton Master: " + jetton_minter_contract_address);
    // let contract_ddd = await client.open(JettonMasterContract.fromAddress(jetton_minter_contract_address));
    // let jetton_wallet = await contract_ddd.getGetWalletAddress(deploy_wallet_contract.address);
    // let contract_dataFormat = JettonDefaultWallet.fromAddress(jetton_wallet);
    // let contract = client.open(contract_dataFormat);
    // console.log("Deployer's JettonWallet: " + contract.address);
    // let jettonWalletBalance = await (await contract.getGetWalletData()).balance;
    // let owner_of_wallet = await (await contract.getGetWalletData()).owner;
    // console.log("JettonWallet Balance: " + jettonWalletBalance);
    // console.log("JettonWallet Owner: \n" + owner_of_wallet);
    // // TODO:
    // // loadOwnershipAssigned => msg.forwardload
    // let aa = loadTransferEvent(src.asSlice());
    // console.log("Mint MemberID: " + aa.item_index + ", by " + aa.minter);
})();
