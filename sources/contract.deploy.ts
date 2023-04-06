import { beginCell, contractAddress, toNano, TonClient, TonClient4, Address,  WalletContractV4, internal, fromNano, Cell} from "ton";
import {mnemonicToPrivateKey} from "ton-crypto";
import {buildOnchainMetadata} from "./utils/jetton-helpers";

import {SampleJetton, storeMint} from "./output/SampleJetton_SampleJetton";
import {JettonDefaultWallet} from "./output/SampleJetton_JettonDefaultWallet";

(async () => { 

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    });

    // const mnemonics = "shed hero drastic knee kit elbow multiply sign tell addict gesture priority degree reward physical surprise decade portion slight speed match tissue nominee puzzle"
    const mnemonics = "MM"

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.

    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let deployer_wallet_contract = client4.open(deployer_wallet);

    // Get deployment wallet balance
    let balance: bigint = await deployer_wallet_contract.getBalance();

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
    // which means any changes will change the smart contract address as well
    let init = await SampleJetton.init(deployer_wallet_contract.address, content, max_supply);
    let jettonMaster = contractAddress(workchain, init);

    let deployAmount = toNano("0.15");

    // send a message on new address contract to deploy it
    let seqno: number = await deployer_wallet_contract.getSeqno();

    //TL-B mint#01fb345b amount:int257 = Mint
    // let msg = beginCell().storeBuffer(Buffer.from("01fb345b", "hex")).storeInt(supply, 257).endCell();
    
    let supply = toNano(1000000000); // specify total supply in nano

    let packed_msg = beginCell()
    .store(
        storeMint({
            $$type: 'Mint',
            amount: supply,
            receiver: deployer_wallet_contract.address
        }
    )).endCell();

    console.log('🛠️Preparing new outgoing massage from deployment wallet. \n' + deployer_wallet_contract.address +'\n Seqno = ', seqno + "\n");
    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON');
    console.log('Minting:: ', fromNano(supply));
    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [internal({
            to: jettonMaster,
            value: deployAmount,
            init: {
                code : init.code,
                data : init.data
            },
            body: packed_msg
        })]
    });
    console.log('======deployment message sent to ======= \n', jettonMaster);
})();