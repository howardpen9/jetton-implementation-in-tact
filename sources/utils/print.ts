import { Address, beginCell, Cell, contractAddress, storeStateInit } from "ton";
import qs from 'qs';
import base64url from "base64url";

export function printSeparator() {
    console.log("========================================================================================");
}

export function printHeader(name: string) {
    printSeparator();
    console.log('Contract: ' + name);
    printSeparator();
}

export function printAddress(address: Address, testnet: boolean = true) {
    console.log("Address: " + address.toString({ testOnly: testnet }));
    console.log("Explorer: " + "https://" + (testnet ? 'testnet.' : '') + "tonapi.io/account/" + address.toString({ testOnly: testnet }));
    printSeparator();
}

export function printDeploy(
    init: { code: Cell, data: Cell }, 
    value: bigint, 
    command: Cell | string, 
    testnet: boolean = true
    ) {

    // Resolve target address
    let to = contractAddress(0, init);

    // Resovle init
    let initStr = base64url(beginCell()
        .store(storeStateInit(init))
        .endCell()
        .toBoc({ idx: false }));

    let link: string;
    if (typeof command === 'string') {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: command,
            amount: value.toString(10),
            init: initStr
        });
    } else {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: "Deploy contract",
            amount: value.toString(10),
            init: initStr,
            bin: base64url(command.toBoc({ idx: false })),
        });
    }
    console.log("Deploy: " + link);
    printSeparator();
}

export function printWrite(
    init: { code: Cell; data: Cell },
    value: bigint,
    command: Cell | string,
    testnet: boolean = true
) {
    // Resolve target address
    let to = contractAddress(0, init);

    // Resovle init
    let initStr = base64url(beginCell().store(storeStateInit(init)).endCell().toBoc({ idx: false }));

    let link: string;
    let theOther: string;

    if (typeof command === "string") {
        link =
            `https://app.tonkeeper.com/transfer/` +
            to.toString({ testOnly: testnet }) +
            "?" +
            qs.stringify({
                text: command,
                amount: value.toString(10),
                // init: initStr, // 🔴
            });
    } else {
        link =
            `https://app.tonkeeper.com/transfer/` +
            to.toString({ testOnly: testnet }) +
            "?" +
            qs.stringify({
                // text: "Deploy contract", // 🔴
                amount: value.toString(10),
                bin: command.toBoc({ idx: false }).toString("base64"),
            });
    }
    console.log("TonKeeper Write: " + link + "\n");
}

export function printURL_Address(
    address: Address,
    value: bigint,
    command: Cell | string,
    testnet: boolean = true
) {
    // Resolve target address
    // Resovle init
    // let initStr = base64url(beginCell().store(storeStateInit(init)).endCell().toBoc({ idx: false }));
    
    let link: string;
    // let theOther: string;

    if (typeof command === "string") {
        // link =
        //     `https://app.tonkeeper.com/transfer/` +
        //     Address.parse(address.toString())
        //     // + address.toString({testOnly: testnet})
        //     // to.toString({ testOnly: testnet }) +
        //     "?" +
        //     qs.stringify({
        //         text: command,
        //         amount: value.toString(10),
        //         // init: initStr, // 🔴
        //     });
        link = "";
    } else {
        link =
            `https://app.tonkeeper.com/transfer/` +
            Address.parse(address.toString()) +
            // + address.toString({testOnly: testnet})
            // to.toString({ testOnly: testnet }) +
            "?" +
            qs.stringify({
                // text: "Deploy contract", // 🔴
                amount: value.toString(10),
                bin: command.toBoc({ idx: false }).toString("base64"),
            });
    }
    console.log("TonKeeper Write: " + link + "\n");
}