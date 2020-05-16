import { FeedRequestBuilder } from "./feedRequestBuilder";
import { IFeedRequestBuilder } from "./iFeedRequestBuilder";

/**
 * The FeedRequest represents a client request to either subscribe to or
 * unsubscribe from one or more market feeds.
 *
 * ### Subscribe to marketdata
 * ```ts
 * const bytes = feedRequest()
 *     .markets("BTCUSD-CNB")
 *     .subscribe()
 *     .build();
 * ```
 *
 * ### Subscribe to trades
 * ```ts
 * const bytes = feedRequest()
 *     .markets("BTCUSD-CNB")
 *     .trades()
 *     .subscribe()
 *     .build();
 * ```
 *
 * ### Unsubscribe from trades
 * ```ts
 * const bytes = feedRequest()
 *     .markets("BTCUSD-CNB")
 *     .trades()
 *     .unsubscribe()
 *     .build();
 * ```
 *
 */
export const feedRequest = (): IFeedRequestBuilder => new FeedRequestBuilder();
