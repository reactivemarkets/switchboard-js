import { ISubscription } from "./iSubscription";

export interface IMarketDataSubscription extends ISubscription {
    /**
     * The number of levels in the market data book.
     */
    readonly depth?: number;

    /**
     * The frequency of updates.
     */
    readonly frequency?: number;

    /**
     * The aggregation grouping granularity.
     */
    readonly grouping?: number;

    /**
     * The set of markets this subscription applies to.
     */
    readonly markets: string[];
}
