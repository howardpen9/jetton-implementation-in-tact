import { Cell, WalletContractV4, beginCell, Address, contractAddress, ContractProvider, TonClient4, TonClient, fromNano, toNano, 
    JettonMaster, JettonWallet} from "ton";
import { printSeparator } from "./utils/print";
import TonWeb from 'tonweb';

// Contract Abi //
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import { StakingContract , loadTransferEvent} from "./output/SampleJetton_StakingContract";
import { Launchpad } from "./output/SampleJetton_Launchpad";
import { Round } from "./output/SampleJetton_Round";

// let owner_address = Address.parse("EQDL9YT8V5VQs0Fpy93C-ogUzlJTIKlasBwHDFv5dJ2rFNx5");

(async () => {
    //create client for testnet sandboxv4 API - alternative endpoint
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    const mnemonics = "beauty accident phrase genre hill story december eye inner uphold lazy birth carry search execute butter crane boy water sight share tuition human climb";
    // const mnemonics = "YOUR OWN mnemonics";
    let workchain = 0; //we are working in basechain.
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    // let secretKey = keyPair.secretKey;

    let deploy_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deploy_wallet_contract = client.open(deploy_wallet);
    console.log("Deployer Wallet Address:  " + deploy_wallet.address);

    let jetton_minter_contract_address = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
    let staking_init = await StakingContract.init(jetton_minter_contract_address, deploy_wallet_contract.address, 15000n);
    let stakingContract_address = contractAddress(workchain, staking_init);
    // let stakingContract_address = Address.parse("EQBqBHj5jZ7l1KyKhKUzEFkwGDDN-eCnD8v1mV8HnprF2GYs");

    console.log("🔴 Checking with Staking Contract: " + stakingContract_address);
    printSeparator();

    let contract = client.open(await StakingContract.fromAddress(stakingContract_address));
    let value_StakingData = await contract.getGetReturnStakingData();
    console.log("✨ Binding IDIA's Wallet Address: " + value_StakingData.this_contract_jettonWallet);
    console.log("✨ Total Score💎: " +value_StakingData.total_score);
    console.log("✨ IndexID(# of staking Record): " + value_StakingData.index);
    console.log("✨ Parameter : " + Number(value_StakingData.parameter) / 1000 );
    printSeparator();

    let list_record2 = await contract.getGetUserStakeAmount();
    if (list_record2.size > 0) {
        const keys = list_record2.keys();
        const value = list_record2.values();
        let temp_value = 0n;

        for (let i = 0; i < keys.length; i++) {    
            console.log("User["+ i + "]:" + keys[i].toString() 
                + " 💎 Ratio: "  + Number(value[i]) / Number(value_StakingData.total_score)
                // + "\nTotal Score: " +  fromNano(value[i].toString()).toString(), '💎IDIA'
                + "\nScore: " + value[i]
                + "\n" );

            temp_value = BigInt(temp_value) + value[i]; 
        }
        console.log("💎 Total Score: " + temp_value);
    }

    printSeparator();
    let list = await contract.getGetUserStakeRecord();
    if (list.size > 0) {        
        const keys = list.keys();
        const value = list.values();
        for (let i = 0; i < keys.length; i++) {
            if (value.length > 0 ) {
            let a = value[i].stake_address;
            let b = value[i].idia_stake_amount;
            let c = value[i].score;
            console.log("✨Index[" + keys[i].toString() + "]:" + a + " |QTY: " + fromNano(b).toString()); 
            console.log('💎 IDIA | Score: ' + c);
            }
        }
    }

    printSeparator();
    let value = toNano("500");
    let new_value = await contract.getGetRatioOfStake(value);
    console.log("If Stake " + fromNano(value).toString()+ "| Return: " + new_value);
    console.log(" | ✨ Will roughly get: " + Number(new_value) / Number(1000000000));
    printSeparator();
    // ================================================================================ //

    let lpd_init = await Launchpad.init(deploy_wallet.address, stakingContract_address);
    let launchpad_contract = contractAddress(workchain, lpd_init);
    let contract_lpd = client.open(await Launchpad.fromAddress(launchpad_contract));
    let round_id = 0n;
    let round_0_address = await contract_lpd.getGetRoundAddress(round_id);
    console.log("Launchpad Address: " + launchpad_contract);
    console.log("Round Contract: " + round_0_address);
    console.log("Round ID: " + round_id);
    printSeparator();
    let client_round = client.open(await Round.fromAddress(round_0_address));
    let round_data = await client_round.getRoundData();
    console.log("Owner: " + round_data.owner);
    console.log("Submit Jetton Wallet(for round contract): " + round_data.round_contract_jetton_wallet);
    console.log("✨✨✨ LPD NewToken Jetton Wallet(for round contract):\n" + round_data.upcoming_token_jetton_wallet);
    console.log("✨LPD NewToken Amount: " + fromNano(round_data.amount_of_upcoming_token));
    console.log(round_data.is_open);
    console.log(round_data.pariticipators);

    // let user_list_bool= await client_round.getGetUserListThisRound();
    let user_list_score= await client_round.getGetUserScoreList();
    if (user_list_score.size > 0) {
        const keys = user_list_score.keys();
        const value = user_list_score.values();
        let temp_value = 0n;
        for (let i = 0; i < keys.length; i++) {    
            console.log("User["+ i + "]:" + keys[i].toString() 
                + " 💎 Ratio: "  + Number(value[i]) / Number(round_data.weights_total)
                + "\nScore: " + value[i]
                + "\n" );

            temp_value = BigInt(temp_value) + value[i]; 
        }
        console.log("💎 Total Score: " + temp_value);
    }

    // const eeee = Cell.fromBase64("te6ccuEBAQEAPgB8AHdSa+1bgB6025XxWgxbktjtBoW/9R/a8gAz+g1OgApiga3wZ2bgLFE/OiCIAAAAAAAAAAAnDdOyR81hrWtCRv5b");
    // let aa = loadTransferEvent(eeee.asSlice());
    // console.log(aa.jetton_amount, aa.sender_address, aa.score);

    // // ================================================================================ //
    // let user1_weight = await contract.getGetUserWeight(deploy_wallet.address);
    // console.log("😍 Deployer Address:" + deploy_wallet.address + " | Weight: " + user1_weight);

    // let temp_addr = Address.parse("EQDL9YT8V5VQs0Fpy93C-ogUzlJTIKlasBwHDFv5dJ2rFNx5")
    // let user2_weight = await contract.getGetUserWeight(temp_addr);
    // console.log("😍 Address:" + temp_addr + " | Weight: " + user2_weight);
})();