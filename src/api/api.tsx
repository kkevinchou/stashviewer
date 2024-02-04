type Stash = {
    Name: string;
    X: number;
    Y: number;
};

type Listing = {
    Stash: Stash;
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
