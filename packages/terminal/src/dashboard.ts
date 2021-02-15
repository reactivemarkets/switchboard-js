/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import * as colors from "colors/safe";

interface IDashboardOptions {
    readonly refresh?: number;
    readonly title?: string;
}

class Dashboard {
    #line: contrib.Widgets.LineElement;
    #log: contrib.Widgets.LogElement;
    #grid: contrib.grid;
    #guage: contrib.Widgets.GaugeElement;
    #menu: blessed.Widgets.ListbarElement;
    #screen: blessed.Widgets.Screen;
    #table: contrib.Widgets.TableElement;
    #timeout: NodeJS.Timeout;

    public constructor({ refresh = 1_000, title = "Switchboard | Reactive Markets" }: IDashboardOptions = {}) {
        this.#screen = blessed.screen({
            title,
        });

        this.#grid = new contrib.grid({ rows: 12, cols: 12, screen: this.#screen });

        this.#line = this.#grid.set(0, 0, 8, 8, contrib.line, {
            label: colors.bold(" Spread "),
            style: { text: "white", baseline: "black" },
            wholeNumbersOnly: false,
            xLabelPadding: 3,
            xPadding: 5,
        });

        this.#table = this.#grid.set(8, 0, 4, 8, contrib.table, {
            columnWidth: [12, 8, 8, 12],
            fg: "light-blue",
            interactive: false,
            label: colors.bold(" Order Book "),
        });

        this.#guage = this.#grid.set(0, 8, 4, 4, contrib.gauge, {
            label: colors.bold(" Buy/Sell Guage "),
        });

        this.#log = this.#grid.set(4, 8, 8, 4, contrib.log, {
            fg: "white",
            label: colors.bold(" Trade History "),
        });

        this.#menu = blessed.listbar({
            parent: this.#screen,
            keys: true,
            bottom: 0,
            left: 0,
            height: 1,
            style: {
                item: {
                    fg: "yellow",
                },
                selected: {
                    bg: "yellow",
                    fg: "black",
                },
            },
            commands: {
                // @ts-ignore
                " Exit": {
                    // @ts-ignore
                    keys: ["q"],
                    callback: () => process.exit(0),
                },
            },
            items: [],
            autoCommandKeys: true,
        });

        this.#screen.key(["escape", "q", "C-c"], () => {
            clearInterval(this.#timeout);

            return process.exit(0);
        });
        this.#screen.on("resize", () => {
            this.#guage.emit("attach");
            this.#line.emit("attach");
            this.#log.emit("attach");
            this.#table.emit("attach");
            this.#menu.emit("attach");
        });
        this.#timeout = setInterval(() => {
            this.render();
        }, refresh);
    }

    public log(message: string) {
        this.#log.log(message);
    }

    public render() {
        this.#screen.render();
    }

    public setLineData(data: contrib.Widgets.LineData[]) {
        this.#line.setData(data);
    }

    public setTableData(data: any) {
        this.#table.setData(data);
    }

    public setGuageData(stack: { percent: number; stroke: string }[]) {
        this.#guage.setStack(stack);
    }

    public showError(error: Error) {
        const prompt = blessed.message({
            parent: this.#screen,
            left: "center",
            top: "center",
            height: "shrink",
            width: "shrink",
            border: "line",
        });

        prompt.error(`${error}`, 0, () => {
            process.exit(1);
        });
    }
}

export const createDashboard = (options?: IDashboardOptions) => {
    return new Dashboard(options);
};
