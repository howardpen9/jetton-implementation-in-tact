
// ===== TEP64 Standard: Jetton Messages ===== // 
message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;              
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}
// For the end-point of the Tx, this data means nothing important.
// (Ref: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)

// ===== LOG Event ===== // 
message TransferEvent {
    sender_address: Address;
    jetton_amount: Int as coins;
    score: Int as uint128;
}

// ================================================================================ //
message AddingJettonAddress {
    this_contract_jettonWallet: Address;
}

message Unstake {
    index_id: Int as uint32;
}

message Redeem {
    queryId: Int as uint64;
    project_id: Int as uint16;
}

message GetWeighted { // ===== on-chain fetch ===== // 
    applied_user_address: Address;
}
/*  ================================================================================
    1/ Need index since the the depositor might be depositing multiple times.
    2/ Each deposits might have different time frame(duration)

    TODO: 單個 Staking 合約支持多種代幣質押的可能性？                                      
*/
contract StakingContract {
    this_contract_jettonWallet: Address;
    owner: Address;                        

    index: Int as uint32 = 0;               
    stake_record: map<Int, StakeRecord>;
    score_list: map<Address, Int>;

    start_time: Int as uint32;
    total_score: Int as uint128 = 0; 
    parameter: Int as uint16;

    init(this_contract_jettonWallet: Address, _owner: Address, parameter: Int) {
        self.this_contract_jettonWallet = this_contract_jettonWallet;
        self.owner = _owner;
        self.parameter = parameter;
        self.start_time = now();
    }

    // 1️⃣ 🔴 Admin: Initially add the Jetton Token Wallet Address, 
    receive(msg: AddingJettonAddress) {  // 0x8012b1a2
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not from owner");
        self.this_contract_jettonWallet = msg.this_contract_jettonWallet;
        self.forward(ctx.sender, "Success".asComment(), false, null);
    }

    // 2️⃣ 正常收款時、由此訊息判斷
    receive(stake: TokenNotification) {  // 0x7362d09c
        let ctx: Context = context();
        require(ctx.sender == self.this_contract_jettonWallet, "not from one of any jetton wallet");

        let score: Int = self.score_function(stake.amount);
        self.stake_record.set(self.index, StakeRecord {stake_address: stake.from, idia_stake_amount: stake.amount, score: score});

        // Update the weight
        let previous_score: Int? = self.score_list.get(stake.from);
        if (previous_score == null) {
            self.score_list.set(stake.from, score);
        } else if (previous_score!! >= 0) {
            previous_score = previous_score!! + score;
            self.score_list.set(stake.from, previous_score);
        }
        
        // Submit the Log Event 
        emit(TransferEvent{sender_address: stake.from, jetton_amount: stake.amount, score: score}.toCell());
        self.total_score = self.total_score + score;
        self.index = self.index + 1;
    }

    // receive(msg: Unstake) {
    //     let record: StakeRecord? = self.stake_record.get(msg.index_id);
    //     // if (record != null) {
    //     //     let temp: StakeRecord = record!!;
    //     //     require(temp.score > 0, "not valid");
    //     // }
    // }

    // receive(msg: ChangeParater) { // TODO
    //     self.parameter = msg.parameter;
    // }

    fun score_function(idia_amount: Int): Int {
        return idia_amount * pow(10, 18) / (now() - self.start_time) * (self.parameter / 1000); // 15000 / 1000
        // TODO: 解釋時間權重在早期的影響力過大的問題
    }

    get fun get_ratio_of_stake(StakeTokenAmount: Int): Int {
        return self.score_function(StakeTokenAmount) * pow(10, 9) / self.total_score;
    }

    get fun get_ratio_of_stake_2(StakeTokenAmount: Int): Int {
        return self.score_function(StakeTokenAmount) * pow(10, 6) / self.total_score;
    }
    
    get fun get_ratio_of_stake_3(StakeTokenAmount: Int): Int {
        return self.score_function(StakeTokenAmount) * 100 / self.total_score / 100;
    }
    
    // To get the ratio of a user in a on-chain ways
    receive(msg: GetWeighted) { // 0x134c687a
        let ctx: Context = context();

        let user_score: Int = self.score_list.get(msg.applied_user_address)!!;
        require(user_score > 0, "no Record");
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors, 
            bounce: true,
            body: PassScoreToRoundContract { // 0xe5fd7f29
                checked_address: msg.applied_user_address,
                return_score:    user_score
            }.toCell()
        });
    }

    // receive(msg: AdminExecute) {}

    receive(msg: Unstake) { // TODO
        let ctx: Context = context();
        let ww: Int = self.score_list.get(ctx.sender)!!;
        require(ww > 0, "not in the list"); // TODO: only checking point
        
        // Send Transfer to self.get_major_jetton_address(myAddress())
        // Transfer the jetton token back: Amount, who 
        let stake_record: StakeRecord = self.stake_record.get(msg.index_id)!!;
        require(stake_record.idia_stake_amount > 0, "don't have value");
        self.stake_record.set(msg.index_id, null);

        send(SendParameters{
            to: self.this_contract_jettonWallet,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: false, // 0x7362d09c - notify new owner
            body: TokenTransfer {
                queryId: 0,
                amount: stake_record.idia_stake_amount,
                destination: ctx.sender,
                response_destination: myAddress(),
                custom_payload: null,
                forward_ton_amount: ton("0.01"),
                forward_payload: emptySlice()
            }.toCell()
        });
    }

    // TODO: Admin 強制 UnStake所有代幣？
    // admin enable to withdraw the token to the original depositor

    receive(){}

    get fun get_user_stake_record(): map<Int, StakeRecord> {
        return self.stake_record;
    }

    get fun get_user_stake_amount(): map<Address, Int> {
        return self.score_list;
    }

    get fun get_return_staking_data(): StakingData {
        return StakingData {
            index:                      self.index,
            this_contract_jettonWallet: self.this_contract_jettonWallet,
            total_score:                self.total_score,
            parameter:                  self.parameter
        };
    }
}

// ===== Data Struct ===== // 
struct StakingData {
    index: Int as uint64;
    this_contract_jettonWallet: Address;
    total_score: Int as coins;
    parameter: Int as uint16;
}

struct StakeRecord {
    stake_address: Address;
    idia_stake_amount: Int as coins;
    score: Int as uint128;              // TODO: 可以後面刪掉
}

/* 
========================= IDO contract ====================================
    - Staking Contract + IDO Main contrct:
    - IDO Contract => Round 1 + Round 2 + ......
    
    - Each Round contract generate by: 
        a)  
===========================================================================
*/

// ========== Admin ==========
message UploadJettonWalletData {
    project_id: Int as uint16;
    funding_period: Int as uint32;
    round_contract_jetton_wallet: Address;
    convert_rate: Int as uint16;
    upcoming_token_jetton_wallet: Address;
    second_owner: Address;
}

message AdminExecute {
    target_project_id: Int as uint16;
}

contract Launchpad {
    project_id: Int as uint16 = 0;
    owner: Address;
    staking_contract: Address;

    init(owner: Address, staking_contract: Address){
        self.owner = owner;
        self.staking_contract = staking_contract;
    }

    receive("Admin:CreateNewRound") { // Since not everytime we need add Second Owner for the project(eg. round)
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not owner");

        let init: StateInit = initOf Round(self.project_id, myAddress(), self.staking_contract);
        send(SendParameters {
            to: contractAddress(init),
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: true,
            code: init.code,
            data: init.data
        }); 
        self.project_id = self.project_id + 1;
    }

    receive(msg: UploadJettonWalletData) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not owner");
        
        send(SendParameters{
            to: self.get_round_address(msg.project_id),
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: true,
            body: AdminUploadJettonWalletData {
                funding_period:               msg.funding_period,
                round_contract_jetton_wallet: msg.round_contract_jetton_wallet,
                convert_rate:                 msg.convert_rate,
                upcoming_token_jetton_wallet: msg.upcoming_token_jetton_wallet,   // Round Contract 在這兩種代幣各自的 Jetton Wallet 
                second_owner:                 msg.second_owner
            }.toCell()
        });
    }

    receive(msg: AdminExecute) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not owner");
        send(SendParameters {
                to: self.get_round_address(msg.target_project_id),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors, 
                bounce: true,
                body: "AdminExecute".asComment()
        });  
    }

    receive("Update Success") {
        send(SendParameters {
                to: self.owner,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors, 
                bounce: true,
                body: "Update LPD Round Contract Success".asComment()
        });  
    }

    // TODO: Change Owner (make sure the sub address also affected)
    // TODO: Change Staking Contract? (還好、因為可以重部署)

    get fun get_round_address(project_id: Int): Address {
        let init: StateInit = initOf Round(project_id, myAddress(), self.staking_contract);
        return contractAddress(init);
    }
}


/* ===========================================================================
Due to the architectural design of TON, "each token owned by an address has its own independent receiving wallet address."
This means you cannot input "token contract messages that can be received into the token contract used for fundraising.
It doesn't make sense."

The actual process is that you must input this "receiving contract" into the target Jetton token contract
and obtain the Wallet Address exclusive to this Jetton token. Only then can you input this message into 
the "target business logic contract".
=========================================================================== */
message PassScoreToRoundContract {
    checked_address: Address;
    return_score: Int as uint64;
}

message AdminUploadJettonWalletData {
    funding_period:                 Int as uint32;
    round_contract_jetton_wallet:   Address;  
    convert_rate:                   Int as uint16;
    upcoming_token_jetton_wallet:   Address;  
    second_owner:                   Address;
}

message UserClaim {
    queryId: Int as uint64;
}

contract Round {
    project_id: Int as uint16;
    owner: Address;
    staking_contract: Address;
    end_time: Int as uint32 = 0;

    round_contract_jetton_wallet: Address?;            // 此合約對於（支持扣款的認購代幣）的 Jetton Wallet, ex: IDIA, BUSD, USDT....
    convert_rate: Int as uint16 = 0;                     // eg. 250, 500, 1000.... convert_rate. range: 0 - 65,535
    upcoming_token_jetton_wallet: Address?;            // 此合約對於 (將要發售的代幣) 的 Jetton Wallet 地址, ex: new token 
    
    amount_of_upcoming_token: Int as coins = 0;        // 將要發售的代幣數量

    is_open: Bool?;

    user_register_list: map<Address, Bool>;    
    pariticipators: Int as uint16 = 0;
    
    user_score_list: map<Address, Int>;              // User's weight in this round, not everyone will have staking info tho
    weights_total: Int as uint64 = 0;                  // TODO:

    second_owner: Address;
    is_inject_funds: Bool; 

    init(project_id: Int, ido_contract: Address, staking_contract: Address){
        self.project_id = project_id;
        self.owner = ido_contract;
        self.staking_contract = staking_contract;

        self.is_inject_funds = false;

        self.second_owner = ido_contract;
    }

    receive(msg: AdminUploadJettonWalletData) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not the admin");
        
        require(msg.funding_period <= 86401, "Time Frame too long");    // TODO: 限制開放註冊的天數最長時間
        self.end_time = now() + msg.funding_period;                     // TODO: close in next 24hr

        require(msg.convert_rate > 1, "ratio too high");
        require(msg.convert_rate < 65535, "ratio too high");
        self.convert_rate = msg.convert_rate; 
        //   250; 1 ARKEN =  0.004 BUSD, 4000; 1 NewToken = 0.00025 IDIA
        //  self.amount_of_funding_token * self.convert_rate = QTY of new Token 

        self.round_contract_jetton_wallet = msg.round_contract_jetton_wallet; // Using which token(eg. IDIA, USDC..) to 扣款
        self.upcoming_token_jetton_wallet = msg.upcoming_token_jetton_wallet;
        self.second_owner = msg.second_owner;

        // TODO: require(self.is_open == null, "not correct status");
        self.is_open = true;
        send(SendParameters { to: ctx.sender, value: 0, mode: SendRemainingValue + SendIgnoreErrors, bounce: true, body: "Update Success".asComment()});  
    }

    receive("Register") {
        let ctx: Context = context();
        require(ctx.value >= ton("0.1"), "not enough TON"); // TODO

        require(self.is_open, "haven't upload the jetton Wallet info");

        send(SendParameters {
            to: self.staking_contract,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors, 
            bounce: true,
            body: GetWeighted { applied_user_address: ctx.sender }.toCell() // 0x134c687a
        });
    }

    receive(msg: PassScoreToRoundContract) { // 0xe5fd7f29
        let ctx: Context = context();
        let participate: Bool? = self.user_register_list.get(msg.checked_address);
        require(participate == null, "Already in the list"); // 拒絕重複登記，會導致傯 score 重複計算。

        // TODO: Better implementation?
        require(self.is_open, "not in status"); 

        self.user_register_list.set(msg.checked_address, true);
        self.pariticipators = self.pariticipators + 1;
        
        self.user_score_list.set(msg.checked_address, msg.return_score);
        self.weights_total = self.weights_total + msg.return_score;

        emit(WeightLog{ weight_total: self.weights_total, pariticipator: msg.checked_address, return_score: msg.return_score }.toCell());
    }

    receive(msg: TokenNotification) {  // 0x7362d09c -> UserSubmit
        // TODO: Admin: Add Funds
        let ctx: Context = context();
        if (ctx.sender == self.round_contract_jetton_wallet) {
            require(now() <= self.end_time, "Not in the right time frame");
            require(self.is_open, "not open yet");


        } else if (ctx.sender == self.upcoming_token_jetton_wallet) {
            // 從這個合約所代表的「所屬新代幣 Jetton Wallet 發過來」才是正確的
            // 並且，要用自訂義 Transfer 來讓 "TokenNotification" 的訊息傳進來時有足夠的 GasFee

            require(msg.from == self.owner || msg.from == self.second_owner, "Not from correct address");
            require(!self.is_inject_funds, "not yet");
            self.is_inject_funds = true;

            // require(!self.is_open, "still in open status");

            self.amount_of_upcoming_token = msg.amount;
            send(SendParameters{
                to: msg.from,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                bounce: true,
                body: "Inject Funds Success".asComment()
            });
        }
    }

    // 🔴 Admin: 
    receive("AdminExecute") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "not the admin");

        self.is_open = false;

        if (self.second_owner != null ) {
            send(SendParameters{
                to: self.owner,
                value: ton("0.01"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: "CloseRound".asComment()
            }); 
        }

        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: true,
            body: "CloseRound".asComment()
        });    
    }

    // ratio = weight / total weight 
    // ratio * 總提供的代幣數量 = 認購到的數量
    // 認購到的數量 * 設定的單價 = 需要扣除的金額
    // 質押數量 - 需扣除的金額 = 剩餘金額 (UserClaim)
    receive(msg: UserClaim) {
        let ctx: Context = context();
        require(self.is_open == false, "in close status");
        require(self.user_score_list.get(ctx.sender) != null, "not the user in the list");

        // 計算份額, 並得到分配到的新代幣數量
        let new_token_qty: Int = self.amount_of_upcoming_token * self.get_user_weights_in_this_round(ctx.sender) / 1000; 
        self.user_score_list.set(ctx.sender, null);

        // 發送新的代幣
        send(SendParameters{
            to: self.upcoming_token_jetton_wallet!!, 
            value: ton("0.1"),
            bounce: false,
            mode: 0,
            body: TokenTransfer { // 0xf8a7ea5 
                queryId: msg.queryId,
                amount: new_token_qty,
                destination: ctx.sender,
                response_destination: myAddress(),
                custom_payload: null, 
                forward_ton_amount: ton("0.01"),
                forward_payload: emptySlice()
            }.toCell()
        });
        
        // the amount of tokens to be deducted [扣款]
        // self.user_refund_list.set(ctx.sender, old_token_qty_deducted);

        // send(SendParameters{
        //     to: self.round_contract_jetton_wallet!!, 
        //     value: ton("0.1"),
        //     bounce: false,
        //     mode: 0,
        //     body: TokenTransfer{ 
        //         queryId: msg.queryId,
        //         amount: old_token_qty_deducted,
        //         destination: myAddress(),
        //         response_destination: ctx.sender,
        //         custom_payload: null, 
        //         forward_ton_amount: ton("0.01"),
        //         forward_payload: emptySlice() // 提交申購的代幣扣完款、贖回
        //     }.toCell()
        // });
    }

    get fun get_user_list_this_round():  map<Address, Bool>{
        return self.user_register_list;
    }

    get fun get_user_weights_in_this_round(user: Address): Int {
        return self.user_score_list.get(user)!! * pow(10, 9) / self.weights_total;
    }

    get fun get_user_score_list(): map<Address, Int> {
        return self.user_score_list;
    }

    get fun round_data(): RoundData {
        return RoundData { 
            project_id: self.project_id,
            owner: self.owner,
            second_owner: self.second_owner,
            end_time: self.end_time,

            round_contract_jetton_wallet: self.round_contract_jetton_wallet,
            convert_rate: self.convert_rate,
            upcoming_token_jetton_wallet: self.upcoming_token_jetton_wallet,
            amount_of_upcoming_token: self.amount_of_upcoming_token,

            is_inject_funds: self.is_inject_funds,
            is_open: self.is_open,
            pariticipators: self.pariticipators,
            weights_total: self.weights_total
        };
    }
}

struct RoundData {
    project_id: Int as uint16;
    owner: Address;
    second_owner: Address;
    end_time: Int as uint32;

    round_contract_jetton_wallet: Address?;
    convert_rate: Int as uint16;
    upcoming_token_jetton_wallet: Address?;
    amount_of_upcoming_token: Int as coins;

    is_inject_funds: Bool;
    is_open: Bool?;

    pariticipators: Int as uint16;
    weights_total: Int as uint64;
}

struct Submit {
    deposite_jetton_amount: Int as coins;   // Applied 
    submit_weight: Int as uint32;           // TODO: Weight = Staking QTY / Total * 1000 => coins(uint21)?
}

message WeightLog {
    weight_total: Int as uint64;
    pariticipator: Address;
    return_score: Int as uint64;
}