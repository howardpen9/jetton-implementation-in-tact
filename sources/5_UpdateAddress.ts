import { Address, beginCell, contractAddress, toNano, TonClient4, TonClient, internal, fromNano, WalletContractV4} from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import {SampleJetton} from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";
import {StakingContract, storeChangeAddress, } from "./output/SampleJetton_StakingContract";


(async () => {

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });
    // const mnemonics = "shed hero drastic knee kit elbow multiply sign tell addict gesture priority degree reward physical surprise decade portion slight speed match tissue nominee puzzle"
    const mnemonics = "beauty accident phrase genre hill story december eye inner uphold lazy birth carry search execute butter crane boy water sight share tuition human climb"

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deployer_wallet_contract = client4.open(deployer_wallet);

    // Get deployment wallet balance
    let balances: bigint = await deployer_wallet_contract.getBalance();

    const jettonParams = {
        name: "May 8",
        description: "This is description of Test tact jetton",
        symbol: "MMM",
        image: "https://avatars.githubusercontent.com/u/104382459?s=280&v=4" 
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano(123456766689011); // Set the specific total supply in nano

    // console.log("✨Calling: " + deployer_wallet_contract.address + "'s JettonWallet");
    
    // let test_message = beginCell()
    //             .storeStringTail("https://cdn.logo.com/hotlink-ok/logo-social.png")
    //         .endCell();



    let new_stakingContract_jettonWallet = Address.parse("EQBBpwbQxhvnYGsY96u2Fkc-6E9pTpdCVgfLgiwmgJrvKubz");
    let packed = beginCell().store(
        storeChangeAddress({
            $$type: 'ChangeAddress',
            new_jetton_wallet_address: new_stakingContract_jettonWallet
        })
    ).endCell();

    let deployAmount = toNano("0.5");
    let seqno: number = await deployer_wallet_contract.getSeqno();
    // let balance: bigint = await deployer_wallet_contract.getBalance();

    let jetton_masterWallet = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");

    let stakingContract_init = await StakingContract.init(jetton_masterWallet, deployer_wallet.address);
    let stakingContract_address = contractAddress(workchain, stakingContract_init);

    // console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON\n\n');
    console.log("\n🛠️ Calling To StakingContract: " + stakingContract_address);
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
            to: stakingContract_address,
            value: deployAmount,
            bounce: true,
            body: packed
        })]
    });
})();
