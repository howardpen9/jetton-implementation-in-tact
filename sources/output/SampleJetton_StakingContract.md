# TACT Compilation Report
Contract: StakingContract
BOC Size: 2132 bytes

# Types
Total Types: 20

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## TokenTransfer
TLB: `token_transfer#0f8a7ea5 queryId:uint64 amount:coins destination:address response_destination:address custom_payload:Maybe ^cell forward_ton_amount:coins forward_payload:remainder<slice> = TokenTransfer`
Signature: `TokenTransfer{queryId:uint64,amount:coins,destination:address,response_destination:address,custom_payload:Maybe ^cell,forward_ton_amount:coins,forward_payload:remainder<slice>}`

## TokenNotification
TLB: `token_notification#7362d09c queryId:uint64 amount:coins from:address forward_payload:remainder<slice> = TokenNotification`
Signature: `TokenNotification{queryId:uint64,amount:coins,from:address,forward_payload:remainder<slice>}`

## TransferEvent
TLB: `transfer_event#526bed5b sender_address:address jetton_amount:coins score:uint128 = TransferEvent`
Signature: `TransferEvent{sender_address:address,jetton_amount:coins,score:uint128}`

## AddingJettonAddress
TLB: `adding_jetton_address#022702dd this_contract_jettonWallet:address = AddingJettonAddress`
Signature: `AddingJettonAddress{this_contract_jettonWallet:address}`

## Unstake
TLB: `unstake#8515738f index_id:uint32 = Unstake`
Signature: `Unstake{index_id:uint32}`

## Redeem
TLB: `redeem#4a906188 queryId:uint64 project_id:uint16 = Redeem`
Signature: `Redeem{queryId:uint64,project_id:uint16}`

## GetWeighted
TLB: `get_weighted#134c687a applied_user_address:address = GetWeighted`
Signature: `GetWeighted{applied_user_address:address}`

## StakingData
TLB: `_ index:uint64 this_contract_jettonWallet:address total_score:coins parameter:uint16 = StakingData`
Signature: `StakingData{index:uint64,this_contract_jettonWallet:address,total_score:coins,parameter:uint16}`

## StakeRecord
TLB: `_ stake_address:address idia_stake_amount:coins score:uint128 = StakeRecord`
Signature: `StakeRecord{stake_address:address,idia_stake_amount:coins,score:uint128}`

## UploadJettonWalletData
TLB: `upload_jetton_wallet_data#80c36a11 project_id:uint16 funding_period:uint32 round_contract_jetton_wallet:address convert_rate:uint16 upcoming_token_jetton_wallet:address second_owner:address = UploadJettonWalletData`
Signature: `UploadJettonWalletData{project_id:uint16,funding_period:uint32,round_contract_jetton_wallet:address,convert_rate:uint16,upcoming_token_jetton_wallet:address,second_owner:address}`

## AdminExecute
TLB: `admin_execute#95c46709 target_project_id:uint16 = AdminExecute`
Signature: `AdminExecute{target_project_id:uint16}`

## PassScoreToRoundContract
TLB: `pass_score_to_round_contract#e5fd7f29 checked_address:address return_score:uint64 = PassScoreToRoundContract`
Signature: `PassScoreToRoundContract{checked_address:address,return_score:uint64}`

## AdminUploadJettonWalletData
TLB: `admin_upload_jetton_wallet_data#e5042c03 funding_period:uint32 round_contract_jetton_wallet:address convert_rate:uint16 upcoming_token_jetton_wallet:address second_owner:address = AdminUploadJettonWalletData`
Signature: `AdminUploadJettonWalletData{funding_period:uint32,round_contract_jetton_wallet:address,convert_rate:uint16,upcoming_token_jetton_wallet:address,second_owner:address}`

## UserClaim
TLB: `user_claim#9f618b86 queryId:uint64 = UserClaim`
Signature: `UserClaim{queryId:uint64}`

## RoundData
TLB: `_ project_id:uint16 owner:address second_owner:address end_time:uint32 round_contract_jetton_wallet:Maybe address convert_rate:uint16 upcoming_token_jetton_wallet:Maybe address amount_of_upcoming_token:coins is_inject_funds:bool is_open:Maybe bool pariticipators:uint16 weights_total:uint64 = RoundData`
Signature: `RoundData{project_id:uint16,owner:address,second_owner:address,end_time:uint32,round_contract_jetton_wallet:Maybe address,convert_rate:uint16,upcoming_token_jetton_wallet:Maybe address,amount_of_upcoming_token:coins,is_inject_funds:bool,is_open:Maybe bool,pariticipators:uint16,weights_total:uint64}`

## Submit
TLB: `_ deposite_jetton_amount:coins submit_weight:uint32 = Submit`
Signature: `Submit{deposite_jetton_amount:coins,submit_weight:uint32}`

## WeightLog
TLB: `weight_log#d696aa87 weight_total:uint64 pariticipator:address return_score:uint64 = WeightLog`
Signature: `WeightLog{weight_total:uint64,pariticipator:address,return_score:uint64}`

# Get Methods
Total Get Methods: 6

## get_ratio_of_stake
Argument: StakeTokenAmount

## get_ratio_of_stake_2
Argument: StakeTokenAmount

## get_ratio_of_stake_3
Argument: StakeTokenAmount

## get_user_stake_record

## get_user_stake_amount

## get_return_staking_data

# Error Codes
2: Stack undeflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
4034: not the user in the list
6582: no Record
7013: don't have value
15748: Not from correct address
17054: not from one of any jetton wallet
21884: not the admin
24241: not open yet
25145: Already in the list
28412: not in status
30226: not enough TON
33986: haven't upload the jetton Wallet info
35067: ratio too high
35179: Time Frame too long
44849: Not in the right time frame
49280: not owner
57660: not in the list
59169: not yet
59383: in close status
61324: not from owner