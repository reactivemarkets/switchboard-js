import { Switchboard } from "@reactivemarkets/switchboard-api";
import { Switchboard as enums } from "@reactivemarkets/switchboard-api/lib/Enum_generated";
import { flatbuffers } from "flatbuffers";
import { fromNumber } from "long";
import { IFeedRequestBuilder } from "./iFeedRequestBuilder";

export class FeedRequestBuilder implements IFeedRequestBuilder {
    #depth?: number;
    #feedType?: enums.FeedType;
    #frequency?: number;
    #grouping?: number;
    #markets?: readonly string[];
    #requestId?: string;
    #subRequestType?: enums.SubReqType;
    #builder = new flatbuffers.Builder();

    public depth(depth?: number) {
        this.#depth = depth;
        return this;
    }

    public frequency(frequency?: number) {
        this.#frequency = frequency;
        return this;
    }

    public grouping(grouping?: number) {
        this.#grouping = grouping;
        return this;
    }

    public liquidations() {
        this.#feedType = enums.FeedType.Liquidation;
        return this;
    }

    public markets(markets: readonly string[]) {
        this.#markets = markets;
        return this;
    }

    public requestId(requestId?: string) {
        this.#requestId = requestId;
        return this;
    }

    public subscribe() {
        this.#subRequestType = enums.SubReqType.Subscribe;
        return this;
    }

    public trades() {
        this.#feedType = enums.FeedType.Trade;
        return this;
    }

    public unsubscribe() {
        this.#subRequestType = enums.SubReqType.Unsubscribe;
        return this;
    }

    public build() {
        const nanos = Date.now() * 1e6;
        const { high, low } = fromNumber(nanos);
        const tts = this.#builder.createLong(low, high);
        const depth = this.#depth;
        const feedType = this.#feedType;
        const frequency = this.#frequency;
        const feedRequestType = this.#subRequestType;
        const grouping = this.#grouping;
        const requestId = this.#requestId ? this.#builder.createString(this.#requestId) : undefined;

        let markets;
        if (this.#markets !== undefined) {
            const marketOffsets = this.#markets.reduce<number[]>((previous, next) => {
                const market = this.#builder.createString(next);
                previous.push(market);
                return previous;
            }, []);
            markets = Switchboard.FeedRequest.createMarketsVector(this.#builder, marketOffsets);
        }

        Switchboard.FeedRequest.start(this.#builder);
        if (requestId !== undefined) {
            Switchboard.FeedRequest.addReqId(this.#builder, requestId);
        }
        if (feedRequestType !== undefined) {
            Switchboard.FeedRequest.addSubReqType(this.#builder, feedRequestType);
        }
        if (feedType !== undefined) {
            Switchboard.FeedRequest.addFeedType(this.#builder, feedType);
        }
        if (frequency !== undefined) {
            Switchboard.FeedRequest.addFrequency(this.#builder, frequency);
        }
        if (grouping !== undefined) {
            Switchboard.FeedRequest.addGrouping(this.#builder, grouping);
        }
        if (markets !== undefined) {
            Switchboard.FeedRequest.addMarkets(this.#builder, markets);
        }
        if (depth !== undefined) {
            Switchboard.FeedRequest.addDepth(this.#builder, depth);
        }
        const feedRequest = Switchboard.FeedRequest.end(this.#builder);

        Switchboard.Message.start(this.#builder);
        Switchboard.Message.addTts(this.#builder, tts);
        Switchboard.Message.addBodyType(this.#builder, Switchboard.Body.FeedRequest);
        Switchboard.Message.addBody(this.#builder, feedRequest);
        const message = Switchboard.Message.end(this.#builder);

        this.#builder.finish(message);

        return this.#builder.asUint8Array();
    }
}
