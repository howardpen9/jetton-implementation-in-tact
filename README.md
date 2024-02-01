# Thinking in Tact

### Usage

```bash
yarn build # To build & compile the contract
yarn test # To run test cases for the contract
yarn deploy # To deploy contract
---
yarn read # To read contract data from the blockchain
yarn d1 # (Optional) To Transfer the Jetton Token to the new account
yarn d2 # (Optional) To generate the Transfer URL to let the new account to transfer the Jetton Token to the other account
```

🔍 Detail can be found in `package.json` LOL

# ✨ Important knowledge points
unt can be set as lower as possible: Same as [TelemintNFT](https://github.com/TelegramMessenger/telemint). I don't know why, but looks like we can set (1e-9 TON) in forward_ton_amount without any error.

### Reference

-   https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons
-   https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
-   https://docs.ton.org/develop/dapps/asset-processing/jettons
-   https://docs.tact-lang.org/learn/jetton/jetton-3
