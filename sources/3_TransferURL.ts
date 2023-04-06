import { Address, beginCell, contractAddress, toNano, Cell, TonClient4 } from "ton";
import { ContractSystem, testAddress } from "ton-emulator";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import { printAddress, printHeader, printDeploy } from "./utils/print";
import { deploy } from "./utils/deploy";

import { SampleJetton} from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";

let deploy_address = Address.parse(""); // The deployer wallet address from mnemonics 
let new_owner_Address = Address.parse(""); // the 

(async () => {
    // This example is for generating the URL for inteacting with Contract by URL
    
    const jettonParams = {
        name: "Test 123 Best Practice",
        description: "This is description of Test tact jetton",
        symbol: "PPPPPPPP",
        image: "https://cdn.logo.com/hotlink-ok/logo-social.png" 
    };

    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano(1234567666666689011); // Set the specific total supply in nano

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well.
    let init = await SampleJetton.init(deploy_address, content, max_supply);
    
    let contract_address = contractAddress(0, init); // Get the Master Jetton Minter Address
    let target_jetton_wallet = await JettonDefaultWallet.fromInit(contract_address, new_owner_Address);
    let new_owner_jetton_wallet = await JettonDefaultWallet.fromInit(contract_address, deploy_address);
    let new_target_jettonWallet_init = await JettonDefaultWallet.init(deploy_address,new_owner_Address);

    console.log("================================================================");
    let deployAmount = toNano("0.55");

    let emptyCell = new Cell(); 

    let packed = beginCell().store(
        storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 0n,
            amount: toNano(12345678),
            destination: target_jetton_wallet.address,
            response_destination: new_owner_jetton_wallet.address, // Original Owner, aka. First Minter's Jetton Wallet
            custom_payload: null,
            forward_ton_amount: toNano("0.1"),
            forward_payload: emptyCell
    })).endCell(); 

    printHeader("Write Contract");
    printAddress(contract_address);

    // printDeploy(init, deployAmount, packed);
    await deploy(new_target_jettonWallet_init, deployAmount, packed);
})();