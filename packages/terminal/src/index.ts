import { FeedClient, toJS, toDate } from "@reactivemarkets/platform-sdk";
import * as colors from "colors/safe";
import * as WebSocket from "ws";
import { options } from "./options";
import { createDashboard } from "./dashboard";

const { apiKey, markets } = options;

const dashboard = createDashboard();

const times: string[] = [];
const prices: number[] = [];
const headers = [colors.white("Qty"), colors.white("Bid"), colors.white("Offer"), colors.white("Qty")];
const book = new Map<number, number[]>();

const feedClient = new FeedClient({
    apiKey,
    WebSocketCtor: WebSocket,
});

feedClient
    .on("error", (err) => {
        dashboard.showError(err);
    })
    .on("open", () => {
        feedClient.subscribeMarketData({
            markets,
        });
        feedClient.subscribeTrades({
            markets,
        });
    })
    .on("md-snapshot-l2", (snapshot) => {
        let bidSize = 0;
        for (let i = 0; i < snapshot.bidSideLength(); i++) {
            const bid = snapshot.bidSide(i);
            const bidPrice = bid?.price();
            const bidQty = bid?.qty();
            if (bidPrice !== undefined && bidQty !== undefined) {
                book.set(i, [bidQty, bidPrice]);
                bidSize += bidQty;
            }
        }

        let offerSize = 0;
        for (let i = 0; i < snapshot.offerSideLength(); i++) {
            const offer = snapshot.offerSide(i);
            const offerPrice = offer?.price();
            const offerQty = offer?.qty();
            if (offerPrice !== undefined && offerQty !== undefined) {
                const row = book.get(i);
                if (row !== undefined) {
                    row.push(offerPrice);
                    row.push(offerQty);
                } else {
                    book.set(i, [offerPrice, offerQty]);
                }
                offerSize += offerQty;
            }
        }

        const snapshotTime = toDate(snapshot.sourceTs()).toISOString().substr(11, 8);

        const data = Array.from(book.values());

        dashboard.setGuageData([
            { percent: +(bidSize / (bidSize + offerSize)).toFixed(2), stroke: "blue" },
            { percent: +(offerSize / (bidSize + offerSize)).toFixed(2), stroke: "green" },
        ]);

        dashboard.setTableData({
            headers,
            data,
        });

        const spread = (data[0][2] ?? 0) - (data[0][1] ?? 0);

        times.push(snapshotTime);
        prices.push(spread);

        while (times.length > 60) {
            times.shift();
            prices.shift();
        }

        const spreadPrices = {
            style: {
                line: "blue",
            },
            x: times,
            y: prices,
        };

        dashboard.setLineData([spreadPrices]);
    })
    .on("public-trade", (trade) => {
        const { price, qty, side, sourceTs } = toJS(trade);

        const time = sourceTs.toISOString().substr(11, 8);
        const coloredSide = side === "buy" ? colors.blue(`${side.toUpperCase()} `) : colors.green(side.toUpperCase());

        dashboard.log(`${colors.gray(time)} ${coloredSide} ${price.toFixed(2)} ${qty.toFixed(5)}`);
    });
