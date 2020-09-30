export interface IFeedRequestBuilder {
    /**
     * Build the bytes to send on the wire.
     */
    build(): Uint8Array;

    /**
     * Specify the desired number of levels in the market data book.
     * @param depth The number of depth levels.
     */
    depth(depth?: number): IFeedRequestBuilder;

    /**
     * Specify the update frequency.
     * @param frequency The frequency to update.
     */
    frequency(frequency?: number): IFeedRequestBuilder;

    /**
     * Specify the aggregation grouping granularity.
     *
     * This parameter is commonly used to describe the tick grouping at each
     * level in the order book, but it may also be used for other purposes.
     * @param grouping The aggregation grouping.
     */
    grouping(grouping?: number): IFeedRequestBuilder;

    /**
     * Specifty the request is for liquidations.
     */
    liquidations(): IFeedRequestBuilder;

    /**
     * Specify the markets this request applies to.
     * @param markets The set of markets.
     */
    markets(markets: readonly string[]): IFeedRequestBuilder;

    /**
     * Specify a client request id.
     * @param requestId The request id.
     */
    requestId(requestId?: string): IFeedRequestBuilder;

    /**
     * Specify the request is for trades.
     */
    trades(): IFeedRequestBuilder;

    /**
     * Specify the request is a subscription.
     */
    subscribe(): Omit<IFeedRequestBuilder, "unsubscribe" | "subscribe">;

    /**
     * Specify the request is a unsubscribe.
     */
    unsubscribe(): Omit<IFeedRequestBuilder, "unsubscribe" | "subscribe">;
}
