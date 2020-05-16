export interface IFeedClientOptions {
    /**
     * The authentication token.
     */
    readonly apiKey: string;

    /**
     * The url of the platform websocket feed.
     */
    readonly feedUrl?: string;

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
