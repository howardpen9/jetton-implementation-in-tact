// import { Address, beginCell, contractAddress, toNano, Cell, TonClient4 } from "ton";
// import { ContractSystem, testAddress } from "ton-emulator";
// import {buildOnchainMetadata} from "./utils/jetton-helpers";
// import { printAddress, printHeader, printDeploy, printWrite } from "./utils/print";
// import { deploy } from "./utils/deploy";

// import { SampleJetton, storeMint} from "./output/SampleJetton_SampleJetton";
// import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";
// import { StakingContract } from "./output/SampleJetton_StakingContract";

// let deploy_address = Address.parse("EQD1ptyvitBi3JbHaDQt_6j-15ABn9BqdABTFA1vgzs3Ae6z"); // The deployer wallet address from mnemonics 
// let new_owner_Address = Address.parse("EQDL9YT8V5VQs0Fpy93C-ogUzlJTIKlasBwHDFv5dJ2rFNx5");

// (async () => {

//     const jettonParams = {
//         name: "May 8",
//         description: "This is description of Test tact jetton",
//         symbol: "MMM",
//         image: "https://avatars.githubusercontent.com/u/104382459?s=280&v=4" 
//     };

//     // Create content Cell
//     let content = buildOnchainMetadata(jettonParams);
//     let max_supply = toNano(123456766689011); // Set the specific total supply in nano
    

//     // Compute init data for deployment
//     // NOTICE: the parameters inside the init functions were the input for the contract address
//     // which means any changes will change the smart contract address as well.
//     let init = await SampleJetton.init(deploy_address, content, max_supply);
//     let contract_address = contractAddress(0, init); // Get the Master Jetton Minter Address

//     let stakingContract_init = await StakingContract.init(contract_address, deploy_address );
//     // let stakingContract_address = contractAddress(0, stakingContract_init);

//     let target_jetton_wallet = await JettonDefaultWallet.init(contract_address, new_owner_Address);
//     // let new_owner_jetton_wallet = await JettonDefaultWallet.fromInit(contract_address, deploy_address);
//     // let new_owner_jetton_wallet = stakingContract_address;
//     // let new_target_jettonWallet_init = await JettonDefaultWallet.init(deploy_address,new_owner_Address);

//     console.log("================================================================");
//     let deployAmount = toNano("0.55");

//     let supply = toNano(666666); // specify total supply in nano
//     let packed_msg = beginCell()
//             .store(
//                 storeMint({
//                     $$type: 'Mint',
//                     amount: supply,
//                     receiver: new_owner_Address
//                 }
//             )).endCell();

//     printHeader("Write Contract");
//     printAddress(contract_address);

//     // printDeploy(init, deployAmount, packed);
//     // await deploy(new_target_jettonWallet_init, deployAmount, packed);
//     printWrite(target_jetton_wallet, deployAmount, packed_msg)
// })();