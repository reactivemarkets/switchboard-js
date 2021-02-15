import { Switchboard } from "@reactivemarkets/switchboard-api";
import { Switchboard as enums } from "@reactivemarkets/switchboard-api/lib/Enum_generated";
import { default as NewLong } from "long";

export const toBidMap = (snapshot: Switchboard.MDSnapshotL2) => {
    const map = new Map<number, number[]>();
    for (let i = 0; i < snapshot.bidSideLength(); i++) {
        const side = snapshot.bidSide(i);
        const price = side?.price();
        const qty = side?.qty();
        if (price !== undefined && qty !== undefined) {
            map.set(i, [price, qty]);
        }
    }

    return map;
};

export const toOfferMap = (snapshot: Switchboard.MDSnapshotL2) => {
    const map = new Map<number, number[]>();
    for (let i = 0; i < snapshot.offerSideLength(); i++) {
        const side = snapshot.offerSide(i);
        const price = side?.price();
        const qty = side?.qty();
        if (price !== undefined && qty !== undefined) {
            map.set(i, [price, qty]);
        }
    }

    return map;
};

export const toDate = (nanos: flatbuffers.Long) => {
    return new Date(nanos.toFloat64() / 1e6);
};

export const toSide = (side: enums.Side) => {
    switch (side) {
        case enums.Side.Buy:
            return "buy";
        case enums.Side.Sell:
            return "sell";
        case enums.Side.None:
        default:
            return undefined;
    }
};

export const toString = (flatbufferLong: flatbuffers.Long) => {
    const test = new NewLong(flatbufferLong.low, flatbufferLong.high);

    return test.toString();
};

type MessageType =
    | Switchboard.FeedRequestAccept
    | Switchboard.FeedRequestReject
    | Switchboard.LiquidationOrder
    | Switchboard.MDSnapshotL2
    | Switchboard.PublicTrade
    | Switchboard.SessionStatus;

export function toJS(message: Switchboard.FeedRequestAccept): { feedId: number; reqId: string };
export function toJS(
    message: Switchboard.FeedRequestReject,
): { errorCode: number; errorMessage: string; reqId: string };
export function toJS(
    message: Switchboard.LiquidationOrder,
): {
    execVenue: string;
    feedId: number;
    flags: number;
    market: string;
    orderId: string;
    price: number;
    qty: number;
    side: "buy" | "sell";
    source: string;
    sourceTs: Date;
};
export function toJS(
    message: Switchboard.MDSnapshotL2,
): {
    bid: Map<number, number[]>;
    depth: number;
    feedId: number;
    flags: number;
    id: string;
    market: string;
    offer: Map<number, number[]>;
    source: string;
    sourceTs: Date;
};
export function toJS(
    message: Switchboard.PublicTrade,
): {
    execVenue: string;
    feedId: number;
    flags: number;
    market: string;
    price: number;
    qty: number;
    side: "buy" | "sell";
    source: string;
    sourceTs: Date;
    tradeId: string;
};
export function toJS(
    message: Switchboard.SessionStatus,
): { code: number; message: string; source: string; sourceTs: Date };
export function toJS(message: MessageType) {
    if ("depth" in message) {
        return {
            bid: toBidMap(message),
            depth: message.depth(),
            feedId: message.feedId(),
            flags: message.flags(),
            id: toString(message.id()),
            market: message.market(),
            offer: toOfferMap(message),
            source: message.source(),
            sourceTs: toDate(message.sourceTs()),
        };
    } else if ("tradeId" in message) {
        return {
            execVenue: message.execVenue(),
            feedId: message.feedId(),
            flags: message.flags(),
            market: message.market(),
            price: message.price(),
            qty: message.qty(),
            side: toSide(message.side()),
            source: message.source(),
            sourceTs: toDate(message.sourceTs()),
            tradeId: message.tradeId(),
        };
    } else if ("orderId" in message) {
        return {
            execVenue: message.execVenue(),
            feedId: message.feedId(),
            flags: message.flags(),
            market: message.market(),
            orderId: message.orderId(),
            price: message.price(),
            qty: message.qty(),
            side: toSide(message.side()),
            source: message.source(),
            sourceTs: toDate(message.sourceTs()),
        };
    } else if ("errorCode" in message) {
        return {
            errorCode: message.errorCode(),
            errorMessage: message.errorMessage(),
            reqId: message.reqId(),
        };
    } else if ("code" in message) {
        return {
            code: message.code(),
            message: message.message(),
            source: message.source(),
            sourceTs: toDate(message.sourceTs()),
        };
    } else {
        return {
            feedId: message.feedId(),
            reqId: message.reqId(),
        };
    }
}
