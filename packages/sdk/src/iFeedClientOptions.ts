export interface IFeedClientOptions {
    /**
     * The authentication token.
     */
    readonly apiKey: string;

    /**
     * Enable debug output from the reconnecting websocket.
     */
    readonly debug?: boolean;

    /**
     * The url of the platform websocket feed.
     */
    readonly feedUrl?: string;

    /**
     * The maximum number of enqueued messages to buffer until reconnection.
     */
    readonly maxEnqueuedMessages?: number;

    /**
     * The maximum number of retries.
     */
    readonly maxRetries?: number;

    /**
     * A custom websocket constructor.
     *
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
