
import { Address, beginCell, contractAddress, toNano, TonClient4, TonClient, internal, JettonMaster, fromNano, WalletContractV4} from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader, printSeparator } from "./utils/print";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import { StakingContract,storeTokenTransfer } from "./output/SampleJetton_StakingContract";

(async () => {

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });
    // const mnemonics = "shed hero drastic knee kit elbow multiply sign tell addict gesture priority degree reward physical surprise decade portion slight speed match tissue nominee puzzle"
    // ===== local TonKeeper (EQD1ptyvitBi3JbHaDQt_6j-15ABn9BqdABTFA1vgzs3Ae6z) ===== // 
    const mnemonics = "beauty accident phrase genre hill story december eye inner uphold lazy birth carry search execute butter crane boy water sight share tuition human climb"

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deployer_wallet_contract = client4.open(deployer_wallet);
    
    let jetton_masterWallet = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
    let staking_init = await StakingContract.init(jetton_masterWallet, deployer_wallet.address, 15000n);
    let stakingContract_address = contractAddress(workchain, staking_init);
    // let stakingContract_address = Address.parse("EQBsoUxWMIBTCy-H5sQ22MElmNd_bxm0cPAlntvNYBMlvn13");

    let packed_stake = beginCell().storeUint(300, 64).endCell();
    let packed = beginCell().store(
        storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 0n,
            amount: toNano("200"),
            destination: stakingContract_address,
            response_destination: deployer_wallet_contract.address, // Original Owner, aka. First Minter's Jetton Wallet
            custom_payload: null,
            forward_ton_amount: toNano("0.0333"),
            forward_payload: packed_stake
    })).endCell(); 


    let deployAmount = toNano("0.3");
    let seqno: number = await deployer_wallet_contract.getSeqno();
    let balance: bigint = await deployer_wallet_contract.getBalance();

    let client_for_jetton = client4.open(await new JettonMaster(jetton_masterWallet));

    let deployer_jetton_wallet = await client_for_jetton.getWalletAddress(deployer_wallet.address);
    console.log("🛠️ Calling To Deployer's JettonWallet:\n" + deployer_jetton_wallet + "\n");
    
    printSeparator();
    console.log("======= 🛠️  Deployer: " + deployer_wallet_contract.address + " sending Txs =====");
    console.log("🔴 Deployer's JettonWallet: " + deployer_jetton_wallet + "(for this jetton token)");
    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON\n\n');
    printSeparator();

    let staking_contract_jetton_wallet = await client_for_jetton.getWalletAddress(stakingContract_address);
    console.log("🟡 StakingContract: "+ stakingContract_address);
    console.log("🟡 Receive Jetton, JettonWallet=> \n" + staking_contract_jetton_wallet);

    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: deployer_jetton_wallet,
                value: deployAmount,
                bounce: true,
                body: packed
        })]
    });
})();

