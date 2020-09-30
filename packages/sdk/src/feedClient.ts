import { PlatformApi } from "@reactivemarkets/platform-api";
import { flatbuffers } from "flatbuffers";
import { TypedEmitter } from "tiny-typed-emitter";
import WebSocket, { CloseEvent, ErrorEvent } from "reconnecting-websocket";
import { feedRequest } from "./domain";
import { IFeedClientOptions } from "./iFeedClientOptions";
import { IPublicTradeSubscription } from "./iPublicTradeSubscription";
import { IMarketDataSubscription } from "./iMarketDataSubscription";
import { ILiquidationSubcription } from "./iLiquidationSubscription";

interface IFeedClientEvents {
    close: (code: number, reason: string) => void;
    error: (err: Error) => void;
    "liquidation-order": (liquidation: PlatformApi.LiquidationOrder) => void;
    "md-snapshot-l2": (snapshot: PlatformApi.MDSnapshotL2) => void;
    open: () => void;
    "public-trade": (trade: PlatformApi.PublicTrade) => void;
    "request-accepted": (accept: PlatformApi.FeedRequestAccept) => void;
    "request-rejected": (reject: PlatformApi.FeedRequestReject) => void;
    "session-status": (status: PlatformApi.SessionStatus) => void;
}

export class FeedClient extends TypedEmitter<IFeedClientEvents> {
    private readonly websocket: WebSocket;

    public constructor(options: IFeedClientOptions) {
        super();

        const {
            apiKey = process.env.REACTIVE_PLATFORM_API_KEY,
            feedUrl = "wss://api.platform.reactivemarkets.com/feed",
            WebSocketCtor,
            ...rest
        } = options;

        this.websocket = new WebSocket(`${feedUrl}?api_key=${apiKey}`, [], {
            WebSocket: WebSocketCtor,
            ...rest,
        });
        this.websocket.binaryType = "arraybuffer";
        this.websocket.onopen = this.onOpen;
        this.websocket.onclose = this.onClose;
        this.websocket.onerror = this.onError;
        this.websocket.onmessage = this.onMessage;
    }

    /**
     * Indicates if the connection is open and ready to communicate.
     *
     * @readonly
     */
    public get isOpen() {
        return this.websocket.readyState === this.websocket.OPEN;
    }

    /**
     * Subscribe to a market data feed with the given options.
     * @param options subscription options
     */
    public subscribeMarketData = (options: IMarketDataSubscription) => {
        const bytes = feedRequest()
            .markets(options.markets)
            .frequency(options.frequency)
            .depth(options.depth)
            .requestId(options.requestId)
            .subscribe()
            .build();

        this.websocket.send(bytes);
    };

    /**
     * Subscribe to a liquidations feed with the given options.
     * @param options subscription options
     */
    public subscribeLiquidations = (options: ILiquidationSubcription) => {
        const bytes = feedRequest()
            .markets(options.markets)
            .requestId(options.requestId)
            .liquidations()
            .subscribe()
            .build();

        this.websocket.send(bytes);
    };

    /**
     * Subscribe to a public trade feed with the given options.
     * @param options subscription options
     */
    public subscribeTrades = (options: IPublicTradeSubscription) => {
        const bytes = feedRequest().markets(options.markets).requestId(options.requestId).trades().subscribe().build();

        this.websocket.send(bytes);
    };

    /**
     * Unsubscribe from a market data feed.
     * @param options subscription options
     */
    public unsubscribeMarketData = (options: Omit<IMarketDataSubscription, "depth" | "frequency" | "grouping">) => {
        const bytes = feedRequest().markets(options.markets).requestId(options.requestId).unsubscribe().build();

        this.websocket.send(bytes);
    };

    /**
     * Unsubscribe from a liquidation feed.
     * @param options subscription options
     */
    public unsubscribeLiquidations = (options: ILiquidationSubcription) => {
        const bytes = feedRequest()
            .markets(options.markets)
            .requestId(options.requestId)
            .liquidations()
            .unsubscribe()
            .build();

        this.websocket.send(bytes);
    };

    /**
     * Unsubscribe from a public trade feed.
     * @param options subscription options
     */
    public unsubscribeTrades = (options: IPublicTradeSubscription) => {
        const bytes = feedRequest()
            .markets(options.markets)
            .requestId(options.requestId)
            .trades()
            .unsubscribe()
            .build();

        this.websocket.send(bytes);
    };

    private onClose = (event: CloseEvent) => {
        this.emit("close", event.code, event.reason);
    };

    private onError = (event: ErrorEvent) => {
        this.emit("error", event.error);
    };

    private onOpen = () => {
        this.emit("open");
    };

    private onMessage = (event: MessageEvent) => {
        const byteBuffer = event.data as ArrayBuffer;

        const bytes = new Uint8Array(byteBuffer);

        const buffer = new flatbuffers.ByteBuffer(bytes);

        const message = PlatformApi.Message.getRoot(buffer);

        const bodyType = message.bodyType();

        switch (bodyType) {
            case PlatformApi.Body.FeedRequestAccept: {
                const body = message.body(new PlatformApi.FeedRequestAccept());
                if (body !== null) {
                    this.emit("request-accepted", body);
                }
                break;
            }
            case PlatformApi.Body.FeedRequestReject: {
                const body = message.body(new PlatformApi.FeedRequestReject());
                if (body !== null) {
                    this.emit("request-rejected", body);
                }
                break;
            }
            case PlatformApi.Body.LiquidationOrder: {
                const body = message.body(new PlatformApi.LiquidationOrder());
                if (body !== null) {
                    this.emit("liquidation-order", body);
                }
                break;
            }
            case PlatformApi.Body.MDSnapshotL2: {
                const body = message.body(new PlatformApi.MDSnapshotL2());
                if (body !== null) {
                    this.emit("md-snapshot-l2", body);
                }
                break;
            }
            case PlatformApi.Body.PublicTrade: {
                const body = message.body(new PlatformApi.PublicTrade());
                if (body !== null) {
                    this.emit("public-trade", body);
                }
                break;
            }
            case PlatformApi.Body.SessionStatus: {
                const body = message.body(new PlatformApi.SessionStatus());
                if (body !== null) {
                    this.emit("session-status", body);
                }
                break;
            }
        }
    };
}
