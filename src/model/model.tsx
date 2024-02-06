export class Item {
    id: string;
    name: string;
    baseType: string;
    image: string;
    row: number;
    column: number;
    width: number;
    height: number;
    stash: string;
    priceAmount: number;
    priceCurrency: string;
    implicitModifiers: Modifier[];
    explicitModifiers: Modifier[];
    craftedModifiers: Modifier[];

    constructor() {
        this.id = "???";
        this.name = "???";
        this.baseType = "???";
        this.image = "???";
        this.row = -1;
        this.column = -1;
        this.width = 1;
        this.height = 1;
        this.stash = "???";
        this.priceAmount = 0;
        this.priceCurrency = "???";
        this.implicitModifiers = [];
        this.explicitModifiers = [];
        this.craftedModifiers = [];
    }
}

export type Modifier = {
    text: string;
    value: number;
    minRange: number;
    maxRange: number;
    tier: number;
};
