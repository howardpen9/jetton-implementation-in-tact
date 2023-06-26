
import { Address, beginCell, contractAddress, toNano, TonClient4, TonClient, internal, JettonMaster, fromNano, WalletContractV4} from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader, printSeparator } from "./utils/print";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import { StakingContract,storeTokenTransfer } from "./output/SampleJetton_StakingContract";
import {Launchpad, storeUploadJettonWalletData, storeUserClaim} from "./output/SampleJetton_Launchpad";

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
    
    // let jetton_masterWallet = contractAddress(workchain, init);
    let jetton_masterWallet = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA"); // IDIA Supposed 
    let newToken_Master= Address.parse("EQDdJD1bMO6oZ1CzrAqvU12hF9C5ax3dNebVxrnjHjSy8skw"); // New Token for LPD

    let staking_init = await StakingContract.init(jetton_masterWallet, deployer_wallet.address, 15000n);
    let stakingContract_address = contractAddress(workchain, staking_init);

    // 取得 Round Contract Address in Round Number
    let lpd_init = await Launchpad.init(deployer_wallet.address, stakingContract_address);
    let lpdContract = contractAddress(workchain, lpd_init);
    let lpd_client = client4.open(Launchpad.fromAddress(lpdContract));
    let round_address_0 = await lpd_client.getGetRoundAddress(0n);
    
    
    let newToken_Master_client = client4.open(await new JettonMaster(newToken_Master));
    let deployer_jetton_wallet = await newToken_Master_client.getWalletAddress(deployer_wallet.address);


    // ========================================================================================== // 
    let packed_stake = beginCell().storeUint(300, 64).endCell();

    let packed_ownerTransfer_newToken = beginCell().store(
        storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 0n,
            amount: toNano("20000"),
            destination: round_address_0,
            response_destination: deployer_wallet_contract.address, // Original Owner, aka. First Minter's Jetton Wallet
            custom_payload: null,
            forward_ton_amount: toNano("0.1"),
            forward_payload: packed_stake
    })).endCell(); 

    let packed_UserClaim = beginCell().store(storeUserClaim({
        $$type: 'UserClaim',
        queryId: 0n
    })).endCell();

    let deployAmount = toNano("0.3");
    let seqno: number = await deployer_wallet_contract.getSeqno();
    let balance: bigint = await deployer_wallet_contract.getBalance();

    console.log("🛠️ Calling To Deployer's JettonWallet:\n" + deployer_jetton_wallet);
    console.log("======= 🛠️  Deployer: " + deployer_wallet_contract.address + " sending Txs =====");
    console.log("🔴 Sending To Deployer's JettonWallet: \n " + deployer_jetton_wallet + "(for this jetton token)");
    printSeparator();
    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON\n');
    console.log("Round Contract: (Receive Notification): \n " + round_address_0);
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: deployer_jetton_wallet,
                value: deployAmount,
                bounce: true,
                body: packed_ownerTransfer_newToken
        })]
    });

    // await deployer_wallet_contract.sendTransfer({
    //     seqno,
    //     secretKey,
    //     messages: [
    //         internal({
    //             to: round_address_0,
    //             value: deployAmount,
    //             bounce: true,
    //             body: packed_UserClaim
    //     })]
    // });
})();

