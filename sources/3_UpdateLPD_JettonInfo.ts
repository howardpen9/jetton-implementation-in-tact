
import { Address, beginCell, contractAddress, toNano, TonClient4, TonClient, internal, fromNano, WalletContractV4, JettonMaster} from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import { StakingContract , storeTokenTransfer} from "./output/SampleJetton_StakingContract";
import {Launchpad, storeUploadJettonWalletData, storeAdminExecute} from "./output/SampleJetton_Launchpad";

// Owner should usually be the deploying wallet's address.
let NewOnwer_Address = Address.parse("EQDL9YT8V5VQs0Fpy93C-ogUzlJTIKlasBwHDFv5dJ2rFNx5");

(async () => {

    //create client for testnet sandboxv4 API - alternative endpoint
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });
    // const mnemonics = "shed hero drastic knee kit elbow multiply sign tell addict gesture priority degree reward physical surprise decade portion slight speed match tissue nominee puzzle"
    const mnemonics = "beauty accident phrase genre hill story december eye inner uphold lazy birth carry search execute butter crane boy water sight share tuition human climb"

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deployer_wallet_contract = client.open(deployer_wallet);

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well.
    
    let jetton_masterWallet = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
    let staking_init = await StakingContract.init(jetton_masterWallet, deployer_wallet.address, 15000n);
    let stakingContract = contractAddress(workchain, staking_init);

    let lpd_init = await Launchpad.init(deployer_wallet.address, stakingContract);
    let lpdContract = contractAddress(workchain, lpd_init);
    
    // 取得 Round Contract Address in Round Number
    let lpd_client = client.open(Launchpad.fromAddress(lpdContract));
    let round_address_0 = await lpd_client.getGetRoundAddress(0n);

    // 
    let jetton_minter_client = client.open(await new JettonMaster(jetton_masterWallet));
    let roundContract_jetton_wallet = await jetton_minter_client.getWalletAddress(round_address_0);

    let upCommingToken_JettonMaster = Address.parse("EQDdJD1bMO6oZ1CzrAqvU12hF9C5ax3dNebVxrnjHjSy8skw");
    let upComingToken_JettonClient = client.open(await new JettonMaster(upCommingToken_JettonMaster));
    let roundContract_upComingToken_JettonWallet = await upComingToken_JettonClient.getWalletAddress(round_address_0);

    let packed = beginCell().store(
        storeUploadJettonWalletData({
            $$type: 'UploadJettonWalletData',
            project_id: 0n,
            funding_period: 86400n,
            round_contract_jetton_wallet: roundContract_jetton_wallet,
            convert_rate: 200n,
            upcoming_token_jetton_wallet: roundContract_upComingToken_JettonWallet,
            second_owner: deployer_wallet.address 
    })).endCell(); 

    let packed_AdminExecute = beginCell().store(
            storeAdminExecute({
                $$type: 'AdminExecute',
                target_project_id: 0n // RoundID
            })
    ).endCell();

    let deployAmount = toNano("0.5");
    let seqno: number = await deployer_wallet_contract.getSeqno();
    let balance: bigint = await deployer_wallet_contract.getBalance();
    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON\n\n');
    console.log("\n🛠️ Calling To LPD Contract:\n" + lpdContract);
    console.log("(Will Pass to Round Contract: " + round_address_0 + ")");
    // await deployer_wallet_contract.sendTransfer({
    //     seqno,
    //     secretKey,
    //     messages: [
    //         internal({
    //         to: lpdContract,
    //         value: deployAmount,
    //         bounce: true,
    //         body: packed
    //         // body: packed_AdminExecute
    //     })]
    // });

    // Admin Execute
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
            to: lpdContract,
            value: deployAmount,
            bounce: true,
            body: packed_AdminExecute
        })]
    });
})();
