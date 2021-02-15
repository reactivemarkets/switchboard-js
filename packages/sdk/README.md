# Reactive Switchboard JavaScript SDK

The Reactive Switchboard SDK for JavaScript. See [Developer Docs](https://developer.reactivemarkets.com) for full documentation

## Quick Start

```js
import { FeedClient, toJS } from "@reactivemarkets/switchboard-sdk";

const feedClient = new FeedClient({
    apiKey: MY_API_KEY,
});

feedClient
    .on("open", () => {
        feedClient.subscribeMarketData({
            markets: ["BTCUSD-CNB"],
        });
    })
    .on("md-snapshot-l2", (snapshot) => {
        console.log(toJS(snapshot));
    });
```

## Installing

```bash
npm i @reactivemarkets/switchboard-sdk
```

## Building

To install all dependencies and build run:

```bash
git clone https://github.com/reactivemarkets/switchboard-js.git
cd switchboard-js
npm ci
npm run build
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on
this repository](https://github.com/reactivemarkets/switchboard-js/tags).

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for
details.
