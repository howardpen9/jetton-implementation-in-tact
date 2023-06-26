import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Cell;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type TransferEvent = {
    $$type: 'TransferEvent';
    sender_address: Address;
    jetton_amount: bigint;
    score: bigint;
}

export function storeTransferEvent(src: TransferEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1382804827, 32);
        b_0.storeAddress(src.sender_address);
        b_0.storeCoins(src.jetton_amount);
        b_0.storeUint(src.score, 128);
    };
}

export function loadTransferEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1382804827) { throw Error('Invalid prefix'); }
    let _sender_address = sc_0.loadAddress();
    let _jetton_amount = sc_0.loadCoins();
    let _score = sc_0.loadUintBig(128);
    return { $$type: 'TransferEvent' as const, sender_address: _sender_address, jetton_amount: _jetton_amount, score: _score };
}

function loadTupleTransferEvent(source: TupleReader) {
    let _sender_address = source.readAddress();
    let _jetton_amount = source.readBigNumber();
    let _score = source.readBigNumber();
    return { $$type: 'TransferEvent' as const, sender_address: _sender_address, jetton_amount: _jetton_amount, score: _score };
}

function storeTupleTransferEvent(source: TransferEvent) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.sender_address);
    builder.writeNumber(source.jetton_amount);
    builder.writeNumber(source.score);
    return builder.build();
}

function dictValueParserTransferEvent(): DictionaryValue<TransferEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransferEvent(src)).endCell());
        },
        parse: (src) => {
            return loadTransferEvent(src.loadRef().beginParse());
        }
    }
}

export type AddingJettonAddress = {
    $$type: 'AddingJettonAddress';
    this_contract_jettonWallet: Address;
}

export function storeAddingJettonAddress(src: AddingJettonAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(36111069, 32);
        b_0.storeAddress(src.this_contract_jettonWallet);
    };
}

export function loadAddingJettonAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 36111069) { throw Error('Invalid prefix'); }
    let _this_contract_jettonWallet = sc_0.loadAddress();
    return { $$type: 'AddingJettonAddress' as const, this_contract_jettonWallet: _this_contract_jettonWallet };
}

function loadTupleAddingJettonAddress(source: TupleReader) {
    let _this_contract_jettonWallet = source.readAddress();
    return { $$type: 'AddingJettonAddress' as const, this_contract_jettonWallet: _this_contract_jettonWallet };
}

function storeTupleAddingJettonAddress(source: AddingJettonAddress) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.this_contract_jettonWallet);
    return builder.build();
}

function dictValueParserAddingJettonAddress(): DictionaryValue<AddingJettonAddress> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddingJettonAddress(src)).endCell());
        },
        parse: (src) => {
            return loadAddingJettonAddress(src.loadRef().beginParse());
        }
    }
}

export type Unstake = {
    $$type: 'Unstake';
    index_id: bigint;
}

export function storeUnstake(src: Unstake) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2232775567, 32);
        b_0.storeUint(src.index_id, 32);
    };
}

export function loadUnstake(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2232775567) { throw Error('Invalid prefix'); }
    let _index_id = sc_0.loadUintBig(32);
    return { $$type: 'Unstake' as const, index_id: _index_id };
}

function loadTupleUnstake(source: TupleReader) {
    let _index_id = source.readBigNumber();
    return { $$type: 'Unstake' as const, index_id: _index_id };
}

function storeTupleUnstake(source: Unstake) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index_id);
    return builder.build();
}

function dictValueParserUnstake(): DictionaryValue<Unstake> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeUnstake(src)).endCell());
        },
        parse: (src) => {
            return loadUnstake(src.loadRef().beginParse());
        }
    }
}

export type Redeem = {
    $$type: 'Redeem';
    queryId: bigint;
    project_id: bigint;
}

export function storeRedeem(src: Redeem) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1250976136, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.project_id, 16);
    };
}

export function loadRedeem(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1250976136) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _project_id = sc_0.loadUintBig(16);
    return { $$type: 'Redeem' as const, queryId: _queryId, project_id: _project_id };
}

function loadTupleRedeem(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _project_id = source.readBigNumber();
    return { $$type: 'Redeem' as const, queryId: _queryId, project_id: _project_id };
}

function storeTupleRedeem(source: Redeem) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.project_id);
    return builder.build();
}

function dictValueParserRedeem(): DictionaryValue<Redeem> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeRedeem(src)).endCell());
        },
        parse: (src) => {
            return loadRedeem(src.loadRef().beginParse());
        }
    }
}

export type GetWeighted = {
    $$type: 'GetWeighted';
    applied_user_address: Address;
}

export function storeGetWeighted(src: GetWeighted) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(323774586, 32);
        b_0.storeAddress(src.applied_user_address);
    };
}

export function loadGetWeighted(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 323774586) { throw Error('Invalid prefix'); }
    let _applied_user_address = sc_0.loadAddress();
    return { $$type: 'GetWeighted' as const, applied_user_address: _applied_user_address };
}

function loadTupleGetWeighted(source: TupleReader) {
    let _applied_user_address = source.readAddress();
    return { $$type: 'GetWeighted' as const, applied_user_address: _applied_user_address };
}

function storeTupleGetWeighted(source: GetWeighted) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.applied_user_address);
    return builder.build();
}

function dictValueParserGetWeighted(): DictionaryValue<GetWeighted> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeGetWeighted(src)).endCell());
        },
        parse: (src) => {
            return loadGetWeighted(src.loadRef().beginParse());
        }
    }
}

export type StakingData = {
    $$type: 'StakingData';
    index: bigint;
    this_contract_jettonWallet: Address;
    total_score: bigint;
    parameter: bigint;
}

export function storeStakingData(src: StakingData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.this_contract_jettonWallet);
        b_0.storeCoins(src.total_score);
        b_0.storeUint(src.parameter, 16);
    };
}

export function loadStakingData(slice: Slice) {
    let sc_0 = slice;
    let _index = sc_0.loadUintBig(64);
    let _this_contract_jettonWallet = sc_0.loadAddress();
    let _total_score = sc_0.loadCoins();
    let _parameter = sc_0.loadUintBig(16);
    return { $$type: 'StakingData' as const, index: _index, this_contract_jettonWallet: _this_contract_jettonWallet, total_score: _total_score, parameter: _parameter };
}

function loadTupleStakingData(source: TupleReader) {
    let _index = source.readBigNumber();
    let _this_contract_jettonWallet = source.readAddress();
    let _total_score = source.readBigNumber();
    let _parameter = source.readBigNumber();
    return { $$type: 'StakingData' as const, index: _index, this_contract_jettonWallet: _this_contract_jettonWallet, total_score: _total_score, parameter: _parameter };
}

function storeTupleStakingData(source: StakingData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index);
    builder.writeAddress(source.this_contract_jettonWallet);
    builder.writeNumber(source.total_score);
    builder.writeNumber(source.parameter);
    return builder.build();
}

function dictValueParserStakingData(): DictionaryValue<StakingData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStakingData(src)).endCell());
        },
        parse: (src) => {
            return loadStakingData(src.loadRef().beginParse());
        }
    }
}

export type StakeRecord = {
    $$type: 'StakeRecord';
    stake_address: Address;
    idia_stake_amount: bigint;
    score: bigint;
}

export function storeStakeRecord(src: StakeRecord) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.stake_address);
        b_0.storeCoins(src.idia_stake_amount);
        b_0.storeUint(src.score, 128);
    };
}

export function loadStakeRecord(slice: Slice) {
    let sc_0 = slice;
    let _stake_address = sc_0.loadAddress();
    let _idia_stake_amount = sc_0.loadCoins();
    let _score = sc_0.loadUintBig(128);
    return { $$type: 'StakeRecord' as const, stake_address: _stake_address, idia_stake_amount: _idia_stake_amount, score: _score };
}

function loadTupleStakeRecord(source: TupleReader) {
    let _stake_address = source.readAddress();
    let _idia_stake_amount = source.readBigNumber();
    let _score = source.readBigNumber();
    return { $$type: 'StakeRecord' as const, stake_address: _stake_address, idia_stake_amount: _idia_stake_amount, score: _score };
}

function storeTupleStakeRecord(source: StakeRecord) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.stake_address);
    builder.writeNumber(source.idia_stake_amount);
    builder.writeNumber(source.score);
    return builder.build();
}

function dictValueParserStakeRecord(): DictionaryValue<StakeRecord> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStakeRecord(src)).endCell());
        },
        parse: (src) => {
            return loadStakeRecord(src.loadRef().beginParse());
        }
    }
}

export type UploadJettonWalletData = {
    $$type: 'UploadJettonWalletData';
    project_id: bigint;
    funding_period: bigint;
    round_contract_jetton_wallet: Address;
    convert_rate: bigint;
    upcoming_token_jetton_wallet: Address;
    second_owner: Address;
}

export function storeUploadJettonWalletData(src: UploadJettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2160290321, 32);
        b_0.storeUint(src.project_id, 16);
        b_0.storeUint(src.funding_period, 32);
        b_0.storeAddress(src.round_contract_jetton_wallet);
        b_0.storeUint(src.convert_rate, 16);
        b_0.storeAddress(src.upcoming_token_jetton_wallet);
        b_0.storeAddress(src.second_owner);
    };
}

export function loadUploadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2160290321) { throw Error('Invalid prefix'); }
    let _project_id = sc_0.loadUintBig(16);
    let _funding_period = sc_0.loadUintBig(32);
    let _round_contract_jetton_wallet = sc_0.loadAddress();
    let _convert_rate = sc_0.loadUintBig(16);
    let _upcoming_token_jetton_wallet = sc_0.loadAddress();
    let _second_owner = sc_0.loadAddress();
    return { $$type: 'UploadJettonWalletData' as const, project_id: _project_id, funding_period: _funding_period, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, second_owner: _second_owner };
}

function loadTupleUploadJettonWalletData(source: TupleReader) {
    let _project_id = source.readBigNumber();
    let _funding_period = source.readBigNumber();
    let _round_contract_jetton_wallet = source.readAddress();
    let _convert_rate = source.readBigNumber();
    let _upcoming_token_jetton_wallet = source.readAddress();
    let _second_owner = source.readAddress();
    return { $$type: 'UploadJettonWalletData' as const, project_id: _project_id, funding_period: _funding_period, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, second_owner: _second_owner };
}

function storeTupleUploadJettonWalletData(source: UploadJettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.project_id);
    builder.writeNumber(source.funding_period);
    builder.writeAddress(source.round_contract_jetton_wallet);
    builder.writeNumber(source.convert_rate);
    builder.writeAddress(source.upcoming_token_jetton_wallet);
    builder.writeAddress(source.second_owner);
    return builder.build();
}

function dictValueParserUploadJettonWalletData(): DictionaryValue<UploadJettonWalletData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeUploadJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadUploadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type AdminExecute = {
    $$type: 'AdminExecute';
    target_project_id: bigint;
}

export function storeAdminExecute(src: AdminExecute) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2512676617, 32);
        b_0.storeUint(src.target_project_id, 16);
    };
}

export function loadAdminExecute(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2512676617) { throw Error('Invalid prefix'); }
    let _target_project_id = sc_0.loadUintBig(16);
    return { $$type: 'AdminExecute' as const, target_project_id: _target_project_id };
}

function loadTupleAdminExecute(source: TupleReader) {
    let _target_project_id = source.readBigNumber();
    return { $$type: 'AdminExecute' as const, target_project_id: _target_project_id };
}

function storeTupleAdminExecute(source: AdminExecute) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.target_project_id);
    return builder.build();
}

function dictValueParserAdminExecute(): DictionaryValue<AdminExecute> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAdminExecute(src)).endCell());
        },
        parse: (src) => {
            return loadAdminExecute(src.loadRef().beginParse());
        }
    }
}

export type PassScoreToRoundContract = {
    $$type: 'PassScoreToRoundContract';
    checked_address: Address;
    return_score: bigint;
}

export function storePassScoreToRoundContract(src: PassScoreToRoundContract) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3858595625, 32);
        b_0.storeAddress(src.checked_address);
        b_0.storeUint(src.return_score, 64);
    };
}

export function loadPassScoreToRoundContract(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3858595625) { throw Error('Invalid prefix'); }
    let _checked_address = sc_0.loadAddress();
    let _return_score = sc_0.loadUintBig(64);
    return { $$type: 'PassScoreToRoundContract' as const, checked_address: _checked_address, return_score: _return_score };
}

function loadTuplePassScoreToRoundContract(source: TupleReader) {
    let _checked_address = source.readAddress();
    let _return_score = source.readBigNumber();
    return { $$type: 'PassScoreToRoundContract' as const, checked_address: _checked_address, return_score: _return_score };
}

function storeTuplePassScoreToRoundContract(source: PassScoreToRoundContract) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.checked_address);
    builder.writeNumber(source.return_score);
    return builder.build();
}

function dictValueParserPassScoreToRoundContract(): DictionaryValue<PassScoreToRoundContract> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storePassScoreToRoundContract(src)).endCell());
        },
        parse: (src) => {
            return loadPassScoreToRoundContract(src.loadRef().beginParse());
        }
    }
}

export type AdminUploadJettonWalletData = {
    $$type: 'AdminUploadJettonWalletData';
    funding_period: bigint;
    round_contract_jetton_wallet: Address;
    convert_rate: bigint;
    upcoming_token_jetton_wallet: Address;
    second_owner: Address;
}

export function storeAdminUploadJettonWalletData(src: AdminUploadJettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3842255875, 32);
        b_0.storeUint(src.funding_period, 32);
        b_0.storeAddress(src.round_contract_jetton_wallet);
        b_0.storeUint(src.convert_rate, 16);
        b_0.storeAddress(src.upcoming_token_jetton_wallet);
        b_0.storeAddress(src.second_owner);
    };
}

export function loadAdminUploadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3842255875) { throw Error('Invalid prefix'); }
    let _funding_period = sc_0.loadUintBig(32);
    let _round_contract_jetton_wallet = sc_0.loadAddress();
    let _convert_rate = sc_0.loadUintBig(16);
    let _upcoming_token_jetton_wallet = sc_0.loadAddress();
    let _second_owner = sc_0.loadAddress();
    return { $$type: 'AdminUploadJettonWalletData' as const, funding_period: _funding_period, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, second_owner: _second_owner };
}

function loadTupleAdminUploadJettonWalletData(source: TupleReader) {
    let _funding_period = source.readBigNumber();
    let _round_contract_jetton_wallet = source.readAddress();
    let _convert_rate = source.readBigNumber();
    let _upcoming_token_jetton_wallet = source.readAddress();
    let _second_owner = source.readAddress();
    return { $$type: 'AdminUploadJettonWalletData' as const, funding_period: _funding_period, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, second_owner: _second_owner };
}

function storeTupleAdminUploadJettonWalletData(source: AdminUploadJettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.funding_period);
    builder.writeAddress(source.round_contract_jetton_wallet);
    builder.writeNumber(source.convert_rate);
    builder.writeAddress(source.upcoming_token_jetton_wallet);
    builder.writeAddress(source.second_owner);
    return builder.build();
}

function dictValueParserAdminUploadJettonWalletData(): DictionaryValue<AdminUploadJettonWalletData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAdminUploadJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadAdminUploadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type UserClaim = {
    $$type: 'UserClaim';
    queryId: bigint;
}

export function storeUserClaim(src: UserClaim) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2673970054, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadUserClaim(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2673970054) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'UserClaim' as const, queryId: _queryId };
}

function loadTupleUserClaim(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'UserClaim' as const, queryId: _queryId };
}

function storeTupleUserClaim(source: UserClaim) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserUserClaim(): DictionaryValue<UserClaim> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeUserClaim(src)).endCell());
        },
        parse: (src) => {
            return loadUserClaim(src.loadRef().beginParse());
        }
    }
}

export type RoundData = {
    $$type: 'RoundData';
    project_id: bigint;
    owner: Address;
    second_owner: Address;
    end_time: bigint;
    round_contract_jetton_wallet: Address | null;
    convert_rate: bigint;
    upcoming_token_jetton_wallet: Address | null;
    amount_of_upcoming_token: bigint;
    is_inject_funds: boolean;
    is_open: boolean | null;
    pariticipators: bigint;
    weights_total: bigint;
}

export function storeRoundData(src: RoundData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.project_id, 16);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.second_owner);
        b_0.storeUint(src.end_time, 32);
        b_0.storeAddress(src.round_contract_jetton_wallet);
        b_0.storeUint(src.convert_rate, 16);
        let b_1 = new Builder();
        b_1.storeAddress(src.upcoming_token_jetton_wallet);
        b_1.storeCoins(src.amount_of_upcoming_token);
        b_1.storeBit(src.is_inject_funds);
        if (src.is_open !== null && src.is_open !== undefined) { b_1.storeBit(true).storeBit(src.is_open); } else { b_1.storeBit(false); }
        b_1.storeUint(src.pariticipators, 16);
        b_1.storeUint(src.weights_total, 64);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadRoundData(slice: Slice) {
    let sc_0 = slice;
    let _project_id = sc_0.loadUintBig(16);
    let _owner = sc_0.loadAddress();
    let _second_owner = sc_0.loadAddress();
    let _end_time = sc_0.loadUintBig(32);
    let _round_contract_jetton_wallet = sc_0.loadMaybeAddress();
    let _convert_rate = sc_0.loadUintBig(16);
    let sc_1 = sc_0.loadRef().beginParse();
    let _upcoming_token_jetton_wallet = sc_1.loadMaybeAddress();
    let _amount_of_upcoming_token = sc_1.loadCoins();
    let _is_inject_funds = sc_1.loadBit();
    let _is_open = sc_1.loadBit() ? sc_1.loadBit() : null;
    let _pariticipators = sc_1.loadUintBig(16);
    let _weights_total = sc_1.loadUintBig(64);
    return { $$type: 'RoundData' as const, project_id: _project_id, owner: _owner, second_owner: _second_owner, end_time: _end_time, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, amount_of_upcoming_token: _amount_of_upcoming_token, is_inject_funds: _is_inject_funds, is_open: _is_open, pariticipators: _pariticipators, weights_total: _weights_total };
}

function loadTupleRoundData(source: TupleReader) {
    let _project_id = source.readBigNumber();
    let _owner = source.readAddress();
    let _second_owner = source.readAddress();
    let _end_time = source.readBigNumber();
    let _round_contract_jetton_wallet = source.readAddressOpt();
    let _convert_rate = source.readBigNumber();
    let _upcoming_token_jetton_wallet = source.readAddressOpt();
    let _amount_of_upcoming_token = source.readBigNumber();
    let _is_inject_funds = source.readBoolean();
    let _is_open = source.readBooleanOpt();
    let _pariticipators = source.readBigNumber();
    let _weights_total = source.readBigNumber();
    return { $$type: 'RoundData' as const, project_id: _project_id, owner: _owner, second_owner: _second_owner, end_time: _end_time, round_contract_jetton_wallet: _round_contract_jetton_wallet, convert_rate: _convert_rate, upcoming_token_jetton_wallet: _upcoming_token_jetton_wallet, amount_of_upcoming_token: _amount_of_upcoming_token, is_inject_funds: _is_inject_funds, is_open: _is_open, pariticipators: _pariticipators, weights_total: _weights_total };
}

function storeTupleRoundData(source: RoundData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.project_id);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.second_owner);
    builder.writeNumber(source.end_time);
    builder.writeAddress(source.round_contract_jetton_wallet);
    builder.writeNumber(source.convert_rate);
    builder.writeAddress(source.upcoming_token_jetton_wallet);
    builder.writeNumber(source.amount_of_upcoming_token);
    builder.writeBoolean(source.is_inject_funds);
    builder.writeBoolean(source.is_open);
    builder.writeNumber(source.pariticipators);
    builder.writeNumber(source.weights_total);
    return builder.build();
}

function dictValueParserRoundData(): DictionaryValue<RoundData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeRoundData(src)).endCell());
        },
        parse: (src) => {
            return loadRoundData(src.loadRef().beginParse());
        }
    }
}

export type Submit = {
    $$type: 'Submit';
    deposite_jetton_amount: bigint;
    submit_weight: bigint;
}

export function storeSubmit(src: Submit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.deposite_jetton_amount);
        b_0.storeUint(src.submit_weight, 32);
    };
}

export function loadSubmit(slice: Slice) {
    let sc_0 = slice;
    let _deposite_jetton_amount = sc_0.loadCoins();
    let _submit_weight = sc_0.loadUintBig(32);
    return { $$type: 'Submit' as const, deposite_jetton_amount: _deposite_jetton_amount, submit_weight: _submit_weight };
}

function loadTupleSubmit(source: TupleReader) {
    let _deposite_jetton_amount = source.readBigNumber();
    let _submit_weight = source.readBigNumber();
    return { $$type: 'Submit' as const, deposite_jetton_amount: _deposite_jetton_amount, submit_weight: _submit_weight };
}

function storeTupleSubmit(source: Submit) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.deposite_jetton_amount);
    builder.writeNumber(source.submit_weight);
    return builder.build();
}

function dictValueParserSubmit(): DictionaryValue<Submit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSubmit(src)).endCell());
        },
        parse: (src) => {
            return loadSubmit(src.loadRef().beginParse());
        }
    }
}

export type WeightLog = {
    $$type: 'WeightLog';
    weight_total: bigint;
    pariticipator: Address;
    return_score: bigint;
}

export function storeWeightLog(src: WeightLog) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3600198279, 32);
        b_0.storeUint(src.weight_total, 64);
        b_0.storeAddress(src.pariticipator);
        b_0.storeUint(src.return_score, 64);
    };
}

export function loadWeightLog(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3600198279) { throw Error('Invalid prefix'); }
    let _weight_total = sc_0.loadUintBig(64);
    let _pariticipator = sc_0.loadAddress();
    let _return_score = sc_0.loadUintBig(64);
    return { $$type: 'WeightLog' as const, weight_total: _weight_total, pariticipator: _pariticipator, return_score: _return_score };
}

function loadTupleWeightLog(source: TupleReader) {
    let _weight_total = source.readBigNumber();
    let _pariticipator = source.readAddress();
    let _return_score = source.readBigNumber();
    return { $$type: 'WeightLog' as const, weight_total: _weight_total, pariticipator: _pariticipator, return_score: _return_score };
}

function storeTupleWeightLog(source: WeightLog) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.weight_total);
    builder.writeAddress(source.pariticipator);
    builder.writeNumber(source.return_score);
    return builder.build();
}

function dictValueParserWeightLog(): DictionaryValue<WeightLog> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeWeightLog(src)).endCell());
        },
        parse: (src) => {
            return loadWeightLog(src.loadRef().beginParse());
        }
    }
}

 type Round_init_args = {
    $$type: 'Round_init_args';
    project_id: bigint;
    ido_contract: Address;
    staking_contract: Address;
}

function initRound_init_args(src: Round_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.project_id, 257);
        b_0.storeAddress(src.ido_contract);
        b_0.storeAddress(src.staking_contract);
    };
}

async function Round_init(project_id: bigint, ido_contract: Address, staking_contract: Address) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initRound_init_args({ $$type: 'Round_init_args', project_id, ido_contract, staking_contract })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const Round_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    4034: { message: `not the user in the list` },
    6582: { message: `no Record` },
    7013: { message: `don't have value` },
    15748: { message: `Not from correct address` },
    17054: { message: `not from one of any jetton wallet` },
    21884: { message: `not the admin` },
    24241: { message: `not open yet` },
    25145: { message: `Already in the list` },
    28412: { message: `not in status` },
    30226: { message: `not enough TON` },
    33986: { message: `haven't upload the jetton Wallet info` },
    35067: { message: `ratio too high` },
    35179: { message: `Time Frame too long` },
    44849: { message: `Not in the right time frame` },
    49280: { message: `not owner` },
    57660: { message: `not in the list` },
    59169: { message: `not yet` },
    59383: { message: `in close status` },
    61324: { message: `not from owner` },
}

const Round_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TransferEvent","header":1382804827,"fields":[{"name":"sender_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"score","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"AddingJettonAddress","header":36111069,"fields":[{"name":"this_contract_jettonWallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Unstake","header":2232775567,"fields":[{"name":"index_id","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"Redeem","header":1250976136,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"project_id","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"GetWeighted","header":323774586,"fields":[{"name":"applied_user_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"StakingData","header":null,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"this_contract_jettonWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"total_score","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"parameter","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"StakeRecord","header":null,"fields":[{"name":"stake_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"idia_stake_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"score","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"UploadJettonWalletData","header":2160290321,"fields":[{"name":"project_id","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"funding_period","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"round_contract_jetton_wallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"convert_rate","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"upcoming_token_jetton_wallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"second_owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AdminExecute","header":2512676617,"fields":[{"name":"target_project_id","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"PassScoreToRoundContract","header":3858595625,"fields":[{"name":"checked_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"return_score","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"AdminUploadJettonWalletData","header":3842255875,"fields":[{"name":"funding_period","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"round_contract_jetton_wallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"convert_rate","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"upcoming_token_jetton_wallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"second_owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"UserClaim","header":2673970054,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"RoundData","header":null,"fields":[{"name":"project_id","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"second_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"end_time","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"round_contract_jetton_wallet","type":{"kind":"simple","type":"address","optional":true}},{"name":"convert_rate","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"upcoming_token_jetton_wallet","type":{"kind":"simple","type":"address","optional":true}},{"name":"amount_of_upcoming_token","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"is_inject_funds","type":{"kind":"simple","type":"bool","optional":false}},{"name":"is_open","type":{"kind":"simple","type":"bool","optional":true}},{"name":"pariticipators","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"weights_total","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Submit","header":null,"fields":[{"name":"deposite_jetton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"submit_weight","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"WeightLog","header":3600198279,"fields":[{"name":"weight_total","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"pariticipator","type":{"kind":"simple","type":"address","optional":false}},{"name":"return_score","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
]

const Round_getters: ABIGetter[] = [
    {"name":"get_user_list_this_round","arguments":[],"returnType":{"kind":"dict","key":"address","value":"bool"}},
    {"name":"get_user_weights_in_this_round","arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_user_score_list","arguments":[],"returnType":{"kind":"dict","key":"address","value":"int"}},
    {"name":"round_data","arguments":[],"returnType":{"kind":"simple","type":"RoundData","optional":false}},
]

const Round_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AdminUploadJettonWalletData"}},
    {"receiver":"internal","message":{"kind":"text","text":"Register"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PassScoreToRoundContract"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenNotification"}},
    {"receiver":"internal","message":{"kind":"text","text":"AdminExecute"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UserClaim"}},
]

export class Round implements Contract {
    
    static async init(project_id: bigint, ido_contract: Address, staking_contract: Address) {
        return await Round_init(project_id, ido_contract, staking_contract);
    }
    
    static async fromInit(project_id: bigint, ido_contract: Address, staking_contract: Address) {
        const init = await Round_init(project_id, ido_contract, staking_contract);
        const address = contractAddress(0, init);
        return new Round(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Round(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Round_types,
        getters: Round_getters,
        receivers: Round_receivers,
        errors: Round_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AdminUploadJettonWalletData | 'Register' | PassScoreToRoundContract | TokenNotification | 'AdminExecute' | UserClaim) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AdminUploadJettonWalletData') {
            body = beginCell().store(storeAdminUploadJettonWalletData(message)).endCell();
        }
        if (message === 'Register') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PassScoreToRoundContract') {
            body = beginCell().store(storePassScoreToRoundContract(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
        }
        if (message === 'AdminExecute') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UserClaim') {
            body = beginCell().store(storeUserClaim(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetUserListThisRound(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_user_list_this_round', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
        return result;
    }
    
    async getGetUserWeightsInThisRound(provider: ContractProvider, user: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(user);
        let source = (await provider.get('get_user_weights_in_this_round', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGetUserScoreList(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_user_score_list', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
        return result;
    }
    
    async getRoundData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('round_data', builder.build())).stack;
        const result = loadTupleRoundData(source);
        return result;
    }
    
}