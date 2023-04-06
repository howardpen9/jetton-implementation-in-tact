
import { Address, beginCell, contractAddress, toNano, TonClient4, TonClient, internal, fromNano, WalletContractV4} from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import {buildOnchainMetadata} from "./utils/jetton-helpers";
import {mnemonicToPrivateKey} from "ton-crypto";

import {SampleJetton} from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";
 
    // Owner should usually be the deploying wallet's address.
    let NewOnwer_Address = Address.parse("kQCBgRI-utROP6bJmQydwWiE-NIPScVW_UGPRhQqvTaMXVYG");

(async () => {
    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });
    
    const mnemonics = 

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; 
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let wallet_contract = client4.open(wallet);

    const jettonParams = {
        name: "Test 123 Best Practice",
        description: "This is description of Test tact jetton",
        symbol: "PPPPPPPP",
        image: "https://cdn.logo.com/hotlink-ok/logo-social.png" 
    };


    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano(1234567666666689011); // Set the specific total supply in nano

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well.
    let init = await SampleJetton.init(wallet_contract.address, content, max_supply);
    let jetton_masterWallet = contractAddress(workchain, init);

    let contract_dataFormat = SampleJetton.fromAddress(jetton_masterWallet);
    let contract = client4.open(contract_dataFormat);
    let jetton_wallet =  await contract.getGetWalletAddress(wallet_contract.address)

    console.log("✨ Calling:\n" + wallet_contract.address + "'s \nJettonWallet ==> ");
    console.log("✨ JettonWallet: \n" + jetton_wallet);
    
    let test_message = beginCell()
                .storeMaybeStringRefTail("https://cdn.logo.com/hotlink-ok/logo-social.png")
            .endCell();

    let packed = beginCell().store(
        storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 0n,
            amount: toNano(16666666),
            destination: NewOnwer_Address,
            response_destination: wallet_contract.address, // Original Owner, aka. First Minter's Jetton Wallet
            custom_payload: null,
            forward_ton_amount: toNano("0.01"),
            forward_payload: test_message
    })).endCell(); 

    let deployAmount = toNano("0.4");
    let seqno: number = await wallet_contract.getSeqno();
    let balance: bigint = await wallet_contract.getBalance();

    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON');
    console.log("\n🛠️ Calling To JettonWallet:\n" + jetton_wallet);
    await wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
            to: jetton_wallet,
            value: deployAmount,
            init: {
                code : init.code,
                data : init.data
            },
            bounce: true,
            body: packed
        })]
    });
})();
