import { Switchboard as enums } from "@reactivemarkets/switchboard-api/lib/Enum_generated";
import { flatbuffers } from "flatbuffers";
import { fromNumber } from "long";
import { toSide, toDate } from "../converters";

describe("converters", () => {
    describe("toDate", () => {
        test("should convert from nanos back to date", () => {
            const { low, high } = fromNumber(Date.now() * 1e6);

            const nanos = new flatbuffers.Long(low, high);

            const date = toDate(nanos);

            expect(date.toDateString()).toBe(new Date().toDateString());
        });
    });

    describe("toSide", () => {
        test.each`
            side               | expected
            ${enums.Side.Buy}  | ${"buy"}
            ${enums.Side.Sell} | ${"sell"}
            ${enums.Side.None} | ${undefined}
        `("should convert $side to $expected", ({ side, expected }) => {
            const jsSide = toSide(side);

            expect(jsSide).toBe(expected);
        });
    });
});
