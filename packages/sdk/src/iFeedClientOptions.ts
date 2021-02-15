export interface IFeedClientOptions {
    /**
     * The authentication token.
     *
     * @readonly
     */
    readonly apiKey: string;

    /**
     * The amount of time to wait for a successful connection.
     *
     * @readonly
     * @default 4_000
     */
    readonly connectionTimeout?: number;

    /**
     * Enable debug output from the reconnecting websocket.
     *
     * @readonly
     * @default false
     */
    readonly debug?: boolean;

    /**
     * The url of the switchboard websocket feed.
     *
     * @readonly
     * @default wss://api.switchboard.reactivemarkets.com/feed
     */
    readonly feedUrl?: string;

    /**
     * The maximum number of enqueued messages to buffer until reconnection.
     *
     * @readonly
     * @default infinity
     */
    readonly maxEnqueuedMessages?: number;

    /**
     * The maximum amount of time between connection retries.
     *
     * @readonly
     * @default 10_000
     */
    readonly maxReconnectionDelay?: number;

    /**
     * The maximum number of retries.
     *
     * @readonly
     * @default infinity
     */
    readonly maxRetries?: number;

    /**
     * The minimum amount of time between connection retries.
     *
     * @readonly
     * @default 1_000 + Math.random() * 4_000
     */
    readonly minReconnectionDelay?: number;

    /**
     * The delay grow factor between reconnections.
     *
     * @readonly
     * @default 1.3
     */
    readonly reconnectionDelayGrowFactor?: number;

    /**
     * A custom websocket constructor.
     *
     * @readonly
     * ### Using ws
     * ```ts
     * import * as WebSocket from "ws";
     *
     * const feedClient = new FeedClient({
     *     WebSocketCtor: WebSocket,
     * });
     * ```
     */
    readonly WebSocketCtor?: unknown;
}
