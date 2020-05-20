import { PlatformApi } from "@reactivemarkets/platform-api";
import { flatbuffers } from "flatbuffers";
import { TypedEmitter } from "tiny-typed-emitter";
import WebSocket, { CloseEvent, ErrorEvent } from "reconnecting-websocket";
import { feedRequest } from "./domain";
import { IFeedClientOptions } from "./iFeedClientOptions";
import { IPublicTradeSubscription } from "./iPublicTradeSubscription";
import { IMarketDataSubscription } from "./iMarketDataSubscription";

interface IFeedClientEvents {
    close: (code: number, reason: string) => void;
    error: (err: Error) => void;
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
            feedUrl = "wss://api.platform.reactivemarkets.com/feed",
            apiKey = process.env.REACTIVE_PLATFORM_API_KEY,
            WebSocketCtor,
        } = options;

        this.websocket = new WebSocket(`${feedUrl}?api_key=${apiKey}`, [], {
            WebSocket: WebSocketCtor,
        });
        this.websocket.onopen = this.onOpen;
        this.websocket.onclose = this.onClose;
        this.websocket.onerror = this.onError;
        this.websocket.onmessage = this.onMessage;
    }

    public subscribeMarketData(options: IMarketDataSubscription) {
        const bytes = feedRequest().markets(options.markets).requestId(options.requestId).subscribe().build();

        this.websocket.send(bytes);
    }

    public unsubscribeMarketData(options: IMarketDataSubscription) {
        const bytes = feedRequest().markets(options.markets).requestId(options.requestId).unsubscribe().build();

        this.websocket.send(bytes);
    }

    public subscribeTrades(options: IPublicTradeSubscription) {
        const bytes = feedRequest().markets(options.markets).requestId(options.requestId).trades().subscribe().build();

        this.websocket.send(bytes);
    }

    public unsubscribeTrades(options: IPublicTradeSubscription) {
        const bytes = feedRequest()
            .markets(options.markets)
            .requestId(options.requestId)
            .trades()
            .unsubscribe()
            .build();

        this.websocket.send(bytes);
    }

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
