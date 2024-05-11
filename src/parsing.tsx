import { ServerItemDescription } from "./model/api.tsx";
import { Item } from "./model/model.tsx";

export const ParseStashJSON = (serverItems: ServerItemDescription[]) => {
    const result: Item[] = [];

    serverItems.forEach((itemDescription: ServerItemDescription) => {
        const item = new Item();

        item.id = itemDescription.Item.id;
        item.name = itemDescription.Item.Name;
        item.baseType = itemDescription.Item.BaseType;
        item.row = itemDescription.Listing.Stash.Y;
        item.column = itemDescription.Listing.Stash.X;
        item.width = itemDescription.Item.W;
        item.height = itemDescription.Item.H;
        item.image = itemDescription.Item.Icon;
        item.stash = itemDescription.Listing.Stash.Name;
        item.priceAmount = itemDescription.Listing.Price.Amount;
        item.priceCurrency = itemDescription.Listing.Price.Currency;

        if (itemDescription.Item.ImplicitMods) {
            itemDescription.Item.ImplicitMods.forEach((text) => {
                item.implicitModifiers.push({
                    text: text,
                    value: 0,
                    minRange: 0,
                    maxRange: 0,
                    tier: 0,
                });
            });
        }

        if (itemDescription.Item.ExplicitMods) {
            itemDescription.Item.ExplicitMods.forEach((text) => {
                item.explicitModifiers.push({
                    text: text,
                    value: 0,
                    minRange: 0,
                    maxRange: 0,
                    tier: 0,
                });
            });
        }

        if (itemDescription.Item.CraftedMods) {
            itemDescription.Item.CraftedMods.forEach((text) => {
                item.craftedModifiers.push({
                    text: text,
                    value: 0,
                    minRange: 0,
                    maxRange: 0,
                    tier: 0,
                });
            });
        }

        if (itemDescription.Item.FracturedMods) {
            itemDescription.Item.FracturedMods.forEach((text) => {
                item.fracturedModifiers.push({
                    text: text,
                    value: 0,
                    minRange: 0,
                    maxRange: 0,
                    tier: 0,
                });
            });
        }

        result.push(item);
    });

    return result;
};
