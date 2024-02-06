type Stash = {
    Name: string;
    X: number;
    Y: number;
};

type Price = {
    Amount: number;
    Currency: string;
};

type Listing = {
    Stash: Stash;
    Price: Price;
};

type ServerItem = {
    id: string;
    Name: string;
    W: number;
    H: number;
    Icon: string;
    BaseType: string;
    ImplicitMods: string[];
    ExplicitMods: string[];
    CraftedMods: string[];
};

export type ServerItemDescription = {
    Name: string;
    Listing: Listing;
    Item: ServerItem;
};
