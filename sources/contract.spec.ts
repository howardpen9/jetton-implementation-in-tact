import { toNano, Address, JettonMaster } from "ton";
import { ContractSystem } from "@tact-lang/emulator";

import { StakingContract } from "./output/SampleJetton_StakingContract";
import { Launchpad } from "./output/SampleJetton_Launchpad";
import { Round } from "./output/SampleJetton_Round";

describe("==== contract Testing ====", () => {
    it("should deploy correctly", async () => {
        // Create ContractSystem and deploy contract
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");

        let nonOwner = system.treasure("non-owner");
        // let jettonMaster = system.open(await JettonMaster())
        // let jettonMaster = Address.parse("EQB0EN3UlNiAEj18cN7qs7rF4rvLKtQ2-bkjMZN4w5A13lXA");
        let contract = system.open(await StakingContract.fromInit(nonOwner.address, owner.address, 15000n));
        console.log("StakingAddress:" + contract.address);

        system.update({ now: 1000 });
        await contract.send(owner, { value: toNano(1) }, null);

        system.name(contract.address, "main");
        let track = system.track(contract);
        await system.run();

        // let jetton_client = system.open(await new JettonMaster(nonOwner.address));
        // let stakingContract_jettonWallet = await jetton_client.getWalletAddress(contract.address);
        // console.log("StakingContract's JettonWallet:: " + stakingContract_jettonWallet);

        // await contract.send(
        //     owner,
        //     { value: toNano(1) },
        //     { $$type: "AddingJettonAddress", this_contract_jettonWallet: stakingContract_jettonWallet }
        // );

        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 0,
                "events": [
                  {
                    "$type": "deploy",
                  },
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "type": "empty",
                      },
                      "bounce": true,
                      "from": "@treasure(owner)",
                      "to": "@main",
                      "type": "internal",
                      "value": "1",
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 5963n,
                  },
                ],
              },
            ]
        `);

        // await contract.send(nonOwner, { value: toNano(1) }, "increment");
        // await system.run();
        // expect(track.collect()).toMatchInlineSnapshot();
    });
});
