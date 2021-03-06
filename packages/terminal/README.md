# Reactive Switchboard Terminal

An example terminal application connecting to the Reactive Switchboard. It displays the order book, public trades and the bid/offer spread.

![Terminal](https://raw.githubusercontent.com/reactivemarkets/switchboard-js/main/packages/terminal/terminal.gif)

## Quick Start

```bash
npm i -g @reactivemarkets/switchboard-terminal
```

You need to give the terminal an api key to connect. You can either set an environment variable `SWITCHBOARD_API_KEY` or pass in via the command line arg `api-key`.

To run with an environment variable:

```bash
switchboard-terminal
```

or with an api key:

```bash
switchboard-terminal --api-key MY_API_KEY
```

## Command Line Usage

For a full list of commands see the built in help:

```bash
switchboard-terminal --help
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
