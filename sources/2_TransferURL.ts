import { Address, beginCell, contractAddress, toNano, Cell, TonClient4, JettonMaster, TonClient } from "ton";
import { ContractSystem, testAddress } from "ton-emulator";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import { printAddress, printHeader, printDeploy, printWrite, printURL_Address } from "./utils/print";
import { deploy } from "./utils/deploy";


import { StakingContract , storeTokenTransfer} from "./output/SampleJetton_StakingContract";

let deploy_address = Address.parse("EQD1ptyvitBi3JbHaDQt_6j-15ABn9BqdABTFA1vgzs3Ae6z"); // The deployer wallet address from mnemonics 

(async () => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });

    // Get Staking Contract 
    let jetton_masterWallet = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
    let staking_init = await StakingContract.init(jetton_masterWallet, deploy_address, 15000n);
    let stakingContract_address = contractAddress(0, staking_init);

    // 🔴🔴🔴 基於此 jetton_masterWallet (root)
    let the_wallet_that_will_call_the_URL = Address.parse("EQDL9YT8V5VQs0Fpy93C-ogUzlJTIKlasBwHDFv5dJ2rFNx5");    // iPhone12
    // let the_wallet_that_will_call_the_URL = Address.parse("kQCI9Wn-bnJD5Et-1X9tRHZMPTS9rxhqxTyKWb-6HIXByAVB"); // iPhon7Plus

    let ccc = client.open(await new JettonMaster(jetton_masterWallet));
    let jetton_wallet = await ccc.getWalletAddress(the_wallet_that_will_call_the_URL);
    
    console.log("================================================================");
    let emptyCell = new Cell(); 
    let packed_stake = beginCell().storeUint(300, 64).endCell();
    let deployAmount = toNano("0.35");

    let packed = beginCell().store(
        storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 0n,
            // amount: toNano("987543210"),
            amount: toNano("500"),
            destination: stakingContract_address,
            response_destination: the_wallet_that_will_call_the_URL,
            custom_payload: null,
            forward_ton_amount: toNano("0.075"),
            forward_payload: packed_stake // TimeStamp
    })).endCell(); 

    printHeader("Write Contract");
    console.log("💎Sending To: " + the_wallet_that_will_call_the_URL + "\n |'s ✨ JettonWallet");
    printAddress(jetton_wallet);

    // printDeploy(init, deployAmount, packed);
    // await deploy(new_target_jettonWallet_init, deployAmount, packed);
    // printWrite(stakingContract_init, deployAmount, packed)
    printURL_Address(jetton_wallet, deployAmount, packed) // Get this wallet's Jetton Wallet, with this packed countent 
})();


