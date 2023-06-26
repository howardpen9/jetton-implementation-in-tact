import { beginCell, contractAddress, toNano, TonClient, TonClient4, Address,  WalletContractV4, internal, fromNano, Cell} from "ton";
import {mnemonicToPrivateKey} from "ton-crypto";

import {StakingContract} from "./output/SampleJetton_StakingContract";
import {Launchpad, storeUploadJettonWalletData} from "./output/SampleJetton_Launchpad";

(async () => { 

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });

    const mnemonics = "beauty accident phrase genre hill story december eye inner uphold lazy birth carry search execute butter crane boy water sight share tuition human climb"

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deployer_wallet_contract = client4.open(deployer_wallet);     // Get deployment wallet balance


    let jettonMaster = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
    let staking_init = await StakingContract.init(jettonMaster, deployer_wallet.address, 15000n);
    let stakingContract = contractAddress(workchain, staking_init);
    // let stakingContract = Address.parse("EQB1Ph2RuNOa36nQ56hHatkVl5W3oJ-CcM7z75FzpZX5bP9_");

    // ============ Get LPD Contract ============ // 
    let lpd_init = await Launchpad.init(deployer_wallet.address, stakingContract);
    let lpdContract = contractAddress(workchain, lpd_init);
    let deployAmount = toNano("0.25");
    let seqno: number = await deployer_wallet_contract.getSeqno();

    console.log("StakingContract: " + stakingContract);
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [internal({
            to: lpdContract,
            value: deployAmount,
            init: {
                code : lpd_init.code,
                data : lpd_init.data
            },
            // body: packed_stake
            body: "Admin:CreateNewRound"
        })]
    });
    console.log('======deployment message sent to LPD contract =======\n', lpdContract);
})();