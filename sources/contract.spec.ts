import { toNano } from "ton";
import { ContractSystem } from "@tact-lang/emulator";
import { SampleTactContract } from "./output/sample_SampleTactContract";

describe("contract", () => {
    it("should deploy correctly", async () => {
        // Create ContractSystem and deploy contract
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");
        let contract = system.open(await SampleTactContract.fromInit(owner.address));
        system.name(contract.address, "main");
        let track = system.track(contract);
        await contract.send(owner, { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
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
                        "cell": "x{946A98B60000000000000000}",
                        "type": "cell",
                      },
                      "bounce": true,
                      "from": "@treasure(owner)",
                      "to": "@main",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 8307n,
                  },
                  {
                    "$type": "sent",
                    "messages": [
                      {
                        "body": {
                          "cell": "x{AFF90F570000000000000000}",
                          "type": "cell",
                        },
                        "bounce": true,
                        "from": "@main",
                        "to": "@treasure(owner)",
                        "type": "internal",
                        "value": 990497000n,
                      },
                    ],
                  },
                ],
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(0n);

        // Increment counter
        await contract.send(owner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 1,
                "events": [
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "increment",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "@treasure(owner)",
                      "to": "@main",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 5495n,
                  },
                ],
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(1n);

        // Non-owner
        await contract.send(nonOwner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 2,
                "events": [
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "increment",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "@treasure(non-owner)",
                      "to": "@main",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "failed",
                    "errorCode": 4429,
                    "errorMessage": "Invalid sender",
                  },
                  {
                    "$type": "sent-bounced",
                    "message": {
                      "body": {
                        "cell": "x{FFFFFFFF00000000696E6372656D656E74}",
                        "type": "cell",
                      },
                      "bounce": false,
                      "from": "@main",
                      "to": "@treasure(non-owner)",
                      "type": "internal",
                      "value": 994873000n,
                    },
                  },
                ],
              },
            ]
        `);
    });
});
