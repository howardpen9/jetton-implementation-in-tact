import { Address, beginCell, contractAddress, toNano, Cell, TonClient4 } from "@ton/ton";
import { ContractSystem, testAddress } from "ton-emulator";
import { buildOnchainMetadata } from "./utils/jetton-helpers";
import { printAddress, printHeader, printDeploy, printSeparator } from "./utils/print";
import { deploy } from "./utils/deploy";

import { SampleJetton } from "./output/SampleJetton_SampleJetton";
import { JettonDefaultWallet, storeTokenTransfer } from "./output/SampleJetton_JettonDefaultWallet";

// 🔴 Jetton Root Address
let jetton_minter_root = Address.parse("");

// 🔴 the caller address that who wants to transfer the jetton(the person who will click the URL)
let caller_wallet_address = Address.parse("");

// 🔴 The Address of new Owner WalletV4 Address
let new_owner_Address = Address.parse("");

(async () => {
    let contract_address = await SampleJetton.fromAddress(jetton_minter_root);

    // Get the Jetton Wallet Address of the deployer
    let target_jetton_wallet_init = await JettonDefaultWallet.init(contract_address.address, caller_wallet_address);

    // Get the Jetton Wallet Address of the new owner
    let new_owner_jetton_wallet = await JettonDefaultWallet.fromInit(contract_address.address, new_owner_Address);
    printSeparator();

    // ✨Pack the forward message into a cell
    const test_message = beginCell()
        .storeBit(1)
        .storeRef(beginCell().storeUint(0, 32).storeBuffer(Buffer.from("Hello, GM. -- Right", "utf-8")).endCell())
        .endCell();

    let deployAmount = toNano("0.3");
    let packed = beginCell()
        .store(
            storeTokenTransfer({
                $$type: "TokenTransfer",
                query_id: 0n,
                amount: toNano(1),
                sender: new_owner_jetton_wallet.address,
                response_destination: caller_wallet_address, // Original Owner, aka. First Minter's Jetton Wallet
                custom_payload: null,
                forward_ton_amount: toNano("0.000000001"),
                forward_payload: test_message,
            })
        )
        .endCell();
    printHeader("Write Contract");
    printAddress(contract_address.address);

    // printDeploy(init, deployAmount, packed);
    await deploy(target_jetton_wallet_init, deployAmount, packed);
})();
