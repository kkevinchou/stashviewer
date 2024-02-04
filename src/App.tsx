import "./App.css";
import PrimarySearchAppBar from "./components/appbar.tsx";
import Box from "@mui/system/Box";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useState } from "react";

type Modifier = {
    text: string;
    value: number;
    minRange: number;
    maxRange: number;
    tier: number;
};

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

type ServerItemDescription = {
    Name: string;
    Listing: Listing;
    Item: ServerItem;
};

class Item {
    id: string;
    name: string;
    baseType: string;
    image: string;
    row: number;
    column: number;
    width: number;
    height: number;
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
        this.implicitModifiers = [];
        this.explicitModifiers = [];
        this.craftedModifiers = [];
    }
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "black",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: "none",
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));

const cellDimension: number = 31;
const itemCellDimension: number = 31;
const borderSize: number = 2;

const parseStashJSON = (serverItems: ServerItemDescription[]) => {
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

        if (itemDescription.Item.ImplicitMods) {
            itemDescription.Item.ImplicitMods.forEach((text) => {
                console.log(text);
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

        result.push(item);
    });

    return result;
};

const generateRenderedItems = (items: Item[]) => {
    const renderedItem: React.ReactElement[] = [];
    items.forEach((item) => {
        renderedItem.push(
            <Box
                position="absolute"
                top={34 + item.row * (cellDimension + borderSize) + "px"}
                left={21 + item.column * (cellDimension + borderSize) + "px"}
                key={item.id}
            >
                <HtmlTooltip
                    placement="top"
                    title={
                        <React.Fragment>
                            <Box>
                                <Typography
                                    color="inherit"
                                    sx={{ textAlign: "center" }}
                                >
                                    <span style={{ color: "#FEFE76" }}>
                                        {item.name}
                                    </span>
                                </Typography>
                                <Typography
                                    color="inherit"
                                    sx={{ textAlign: "center" }}
                                >
                                    <span style={{ color: "#FEFE76" }}>
                                        {item.baseType}
                                    </span>
                                </Typography>
                                <Divider
                                    sx={{
                                        backgroundColor: "yellow",
                                    }}
                                ></Divider>
                                {item.implicitModifiers.map(
                                    (modifier, index) => (
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                            }}
                                            key={item.id + "implicit" + index}
                                        >
                                            <span style={{ color: "#8787FE" }}>
                                                {modifier.text}
                                            </span>
                                        </Typography>
                                    )
                                )}
                                {item.implicitModifiers.length > 0 ? (
                                    <Divider
                                        sx={{
                                            backgroundColor: "yellow",
                                        }}
                                    ></Divider>
                                ) : null}
                                {item.explicitModifiers.map(
                                    (modifier, index) => (
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                            }}
                                            key={item.id + "explicit" + index}
                                        >
                                            <span style={{ color: "#8787FE" }}>
                                                {modifier.text}
                                            </span>
                                        </Typography>
                                    )
                                )}
                                {item.craftedModifiers.map(
                                    (modifier, index) => (
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                            }}
                                            key={item.id + "crafted" + index}
                                        >
                                            <span style={{ color: "#ADD8E6" }}>
                                                {modifier.text}
                                            </span>
                                        </Typography>
                                    )
                                )}
                            </Box>
                        </React.Fragment>
                    }
                >
                    <img
                        width={
                            item.width * itemCellDimension +
                            (item.width - 1) * borderSize
                        }
                        height={
                            item.height * itemCellDimension +
                            (item.height - 1) * borderSize
                        }
                        src={item.image}
                    ></img>
                </HtmlTooltip>
            </Box>
        );
    });

    return renderedItem;
};

function App() {
    const [items, setItems] = useState<Item[]>([]);

    function handleClick() {
        fetch("http://localhost:8080/search?account=kkevinchou", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                setItems(parseStashJSON(jsonResponse.Result));
            });
    }

    return (
        <>
            <PrimarySearchAppBar></PrimarySearchAppBar>
            <Box
                display="flex"
                sx={{ width: "100%", paddingTop: 3 }}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Box
                    sx={{
                        width: 833,
                        height: 863,
                        backgroundImage: 'url("src/assets/quadtab2.png")',
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                        borderRadius: 3,
                    }}
                    position={"relative"}
                >
                    {generateRenderedItems(items)}
                </Box>
            </Box>
            <Button variant="contained" onClick={handleClick}>
                Load
            </Button>
        </>
    );
}

export default App;
