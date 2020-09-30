import { ISubscription } from "./iSubscription";

export interface ILiquidationSubcription extends ISubscription {
    /**
     * The set of markets this subscription applies to.
     *
     * @readonly
     */
    readonly markets: readonly string[];
}
