import { FeedClient, toJS } from "@reactivemarkets/switchboard-sdk";
import * as WebSocket from "ws";
import { options } from "./options";

const { apiKey, markets } = options;

const feedClient = new FeedClient({
    apiKey,
    WebSocketCtor: WebSocket,
});

feedClient
    .on("open", () => {
        feedClient.subscribeMarketData({
            markets,
        });
    })
    .on("close", (code, reason) => {
        console.log(`Disconnected, ${code} ${reason}`);
    })
    .on("error", (err) => {
        console.error(`${err}`);
    })
    .on("request-accepted", (accept) => {
        const { feedId, reqId } = toJS(accept);

        console.log(`Accepted: ${reqId} ${feedId}`);
    })
    .on("request-rejected", (reject) => {
        const { errorCode, errorMessage, reqId } = toJS(reject);

        console.log(`Rejected: ${reqId} ${errorCode} ${errorMessage}`);
    })
    .on("liquidation-order", (liquidation) => {
        const { market, price, qty, side } = toJS(liquidation);

        console.log(`Liquidation: ${side} ${market} ${price} ${qty}`);
    })
    .on("md-snapshot-l2", (snapshot) => {
        console.log(toJS(snapshot));
    })
    .on("public-trade", (trade) => {
        const { execVenue, market, price, qty, side } = toJS(trade);

        console.log(`Trade: ${execVenue} ${side} ${market} ${price} ${qty}`);
    })
    .on("session-status", (status) => {
        const { code, message } = toJS(status);

        console.log(`Status: ${code} ${message}`);
    });
