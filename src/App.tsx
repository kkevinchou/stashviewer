import "./App.css";
import PrimarySearchAppBar from "./components/appbar.tsx";
import Box from "@mui/system/Box";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SearchResult2 from "./assets/search_result2.json";
import Divider from "@mui/material/Divider";

type Modifier = {
    text: string;
    value: number;
    minRange: number;
    maxRange: number;
    tier: number;
};

class Item {
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
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: "none",
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));

const cellDimension: number = 31;
const itemCellDimension: number = 31;
const borderSize: number = 2;

const parseStashJSON = () => {
    const result: Item[] = [];

    const obj = SearchResult2;
    obj.result.forEach((itemDescription) => {
        const item = new Item();

        item.name = itemDescription.item.name;
        item.baseType = itemDescription.item.baseType;
        item.row = itemDescription.listing.stash.y;
        item.column = itemDescription.listing.stash.x;
        item.width = itemDescription.item.w;
        item.height = itemDescription.item.h;
        item.image = itemDescription.item.icon;

        if (itemDescription.item.implicitMods) {
            itemDescription.item.implicitMods.forEach((text) => {
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

        if (itemDescription.item.explicitMods) {
            itemDescription.item.explicitMods.forEach((text) => {
                item.explicitModifiers.push({
                    text: text,
                    value: 0,
                    minRange: 0,
                    maxRange: 0,
                    tier: 0,
                });
            });
        }

        if (itemDescription.item.craftedMods) {
            itemDescription.item.craftedMods.forEach((text) => {
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

const generateRenderedItems = () => {
    const items = parseStashJSON();
    const renderedItem: React.ReactElement[] = [];

    items.forEach((item) => {
        renderedItem.push(
            <Box
                position="absolute"
                top={34 + item.row * (cellDimension + borderSize) + "px"}
                left={21 + item.column * (cellDimension + borderSize) + "px"}
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
                                    <span style={{ color: "yellow" }}>
                                        {item.name}
                                    </span>
                                </Typography>
                                <Typography
                                    color="inherit"
                                    sx={{ textAlign: "center" }}
                                >
                                    <span style={{ color: "yellow" }}>
                                        {item.baseType}
                                    </span>
                                </Typography>
                                <Divider
                                    sx={{
                                        backgroundColor: "yellow",
                                    }}
                                ></Divider>
                                {item.implicitModifiers.map((modifier) => (
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <span style={{ color: "blue" }}>
                                            {modifier.text}
                                        </span>
                                    </Typography>
                                ))}
                                {item.implicitModifiers.length > 0 ? (
                                    <Divider
                                        sx={{
                                            backgroundColor: "yellow",
                                        }}
                                    ></Divider>
                                ) : null}
                                {item.explicitModifiers.map((modifier) => (
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <span style={{ color: "blue" }}>
                                            {modifier.text}
                                        </span>
                                    </Typography>
                                ))}
                                {item.craftedModifiers.map((modifier) => (
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <span style={{ color: "#ADD8E6" }}>
                                            {modifier.text}
                                        </span>
                                    </Typography>
                                ))}
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
                    {generateRenderedItems()}
                </Box>
            </Box>
        </>
    );
}

export default App;
