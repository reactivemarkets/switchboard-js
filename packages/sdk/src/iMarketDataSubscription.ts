import { ISubscription } from "./iSubscription";

export interface IMarketDataSubscription extends ISubscription {
    /**
     * The number of levels in the market data book.
     *
     * @readonly
     */
    readonly depth?: number;

    /**
     * The frequency of updates in milliseconds.
     *
     * @readonly
     */
    readonly frequency?: number;

    /**
     * The aggregation grouping granularity.
     *
     * @readonly
     */
    readonly grouping?: number;

    /**
     * The set of markets this subscription applies to.
     *
     * @readonly
     */
    readonly markets: readonly string[];
}
