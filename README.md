# Reactive Platform JavaScript

The Reactive Platform SDK and examples for JavaScript.

* See [Browser](./packages/examples-browser/src/index.tsx) for browser example.
* See [Node](./packages/examples-node/src/index.ts) for node example.
* See [Terminal](./packages/terminal/README.md) for an example terminal application.
* See [Developer Docs](https://reactivemarkets.github.io/developer/) for full documentation.

## Quick Start

```JavaScript
import { FeedClient } from "@reactivemarkets/platform-sdk";

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
npm i @reactivemarkets/platform-sdk
```

## Building

To install all dependencies and build run:

```bash
git clone https://github.com/reactivemarkets/platform-js.git
cd platform-js
npm ci
npm run build
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details
on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on
this repository](https://github.com/reactivemarkets/platform-js/tags).

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for
details.
