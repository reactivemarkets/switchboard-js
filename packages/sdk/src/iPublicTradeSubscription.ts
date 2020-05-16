import { ISubscription } from "./iSubscription";

export interface IPublicTradeSubscription extends ISubscription {
    /**
     * The set of markets this subscription applies to.
     */
    readonly markets: string[];
}
