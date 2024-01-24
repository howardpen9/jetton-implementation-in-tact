import * as dotenv from "dotenv";

dotenv.config();
import { transferJetton } from "./1_TransferFromOwner2Alison";

(async () => {
    await transferJetton(process.env.MNEMONICS_ALISON as string, process.env.TON_WALLET_ADDRESS_BECKY as string);
})();
