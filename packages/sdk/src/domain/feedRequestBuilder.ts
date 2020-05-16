import { PlatformApi } from "@reactivemarkets/platform-api";
import { PlatformApi as enums } from "@reactivemarkets/platform-api/js/Enum_generated";
import { flatbuffers } from "flatbuffers";
import { fromNumber } from "long";
import { IFeedRequestBuilder } from "./iFeedRequestBuilder";

export class FeedRequestBuilder implements IFeedRequestBuilder {
    #depth?: number;
    #feedType?: enums.FeedType;
    #frequency?: number;
    #grouping?: number;
    #markets?: string[];
    #requestId?: string;
    #subRequestType?: enums.SubReqType;
    private readonly builder = new flatbuffers.Builder();

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

    public markets(markets: string[]) {
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
        const tts = this.builder.createLong(low, high);
        const depth = this.#depth;
        const feedType = this.#feedType;
        const frequency = this.#frequency;
        const feedRequestType = this.#subRequestType;
        const grouping = this.#grouping;
        const requestId = this.#requestId ? this.builder.createString(this.#requestId) : undefined;

        let markets;
        if (this.#markets !== undefined) {
            const marketOffsets = this.#markets.reduce<number[]>((previous, next) => {
                const market = this.builder.createString(next);
                previous.push(market);
                return previous;
            }, []);
            markets = PlatformApi.FeedRequest.createMarketsVector(this.builder, marketOffsets);
        }

        PlatformApi.FeedRequest.start(this.builder);
        if (requestId !== undefined) {
            PlatformApi.FeedRequest.addReqId(this.builder, requestId);
        }
        if (feedRequestType !== undefined) {
            PlatformApi.FeedRequest.addSubReqType(this.builder, feedRequestType);
        }
        if (feedType !== undefined) {
            PlatformApi.FeedRequest.addFeedType(this.builder, feedType);
        }
        if (frequency !== undefined) {
            PlatformApi.FeedRequest.addFrequency(this.builder, frequency);
        }
        if (grouping !== undefined) {
            PlatformApi.FeedRequest.addGrouping(this.builder, grouping);
        }
        if (markets !== undefined) {
            PlatformApi.FeedRequest.addMarkets(this.builder, markets);
        }
        if (depth !== undefined) {
            PlatformApi.FeedRequest.addDepth(this.builder, depth);
        }
        const feedRequest = PlatformApi.FeedRequest.end(this.builder);

        PlatformApi.Message.start(this.builder);
        PlatformApi.Message.addTts(this.builder, tts);
        PlatformApi.Message.addBodyType(this.builder, PlatformApi.Body.FeedRequest);
        PlatformApi.Message.addBody(this.builder, feedRequest);
        const message = PlatformApi.Message.end(this.builder);

        this.builder.finish(message);

        return this.builder.asUint8Array();
    }
}
