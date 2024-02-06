import "./App.css";
import Box from "@mui/system/Box";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useState } from "react";
import { ServerItemDescription } from "./api/api.tsx";
import { Item } from "./model/model.tsx";
import { HtmlTooltip } from "./components/htmltooltip.tsx";
import SelectedListItem from "./components/selectedlistitem.tsx";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import divineorb from "./assets/divineorb.png";
import chaosorb from "./assets/chaosorb.png";

const theme = createTheme({
    palette: {
        primary: {
            light: "#005B41",
            main: "#0F0F0F",
            dark: "#232D3F",
            contrastText: "#fff",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#FFFFFF",
        },
    },
});

const cellDimension: number = 31;
const itemCellDimension: number = 31;
const borderSize: number = 2;

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [account, setAccount] = useState("kkevinchou");
    const [stashTabs, setStashTabs] = useState<string[]>([]);
    const [selectedStashIndex, setSelectedSttashIndex] = React.useState(1);
    const [selectedStash, setSelectedStash] = React.useState("");

    const handleListItemClick = (index: number, name: string) => {
        setSelectedSttashIndex(index);
        setSelectedStash(name);
    };

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAccount(event.target.value);
    }

    function handleClick() {
        fetch("http://localhost:8080/search?account=" + account, {
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
                const stashJSON = parseStashJSON(jsonResponse.Result);
                const stashes: string[] = [];
                stashJSON.forEach((item) => {
                    stashes.push(item.stash);
                });
                setItems(stashJSON);
                const uniqueStashTabs = Array.from(new Set(stashes));
                setStashTabs(uniqueStashTabs);
                if (uniqueStashTabs.length > 0) {
                    setSelectedSttashIndex(0);
                    setSelectedStash(uniqueStashTabs[0]);
                }
            });
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box
                    display="flex"
                    sx={{ width: "100%", paddingTop: 3 }}
                    alignContent={"center"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Box sx={{ height: 863 }}>
                        <Box
                            sx={{
                                boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                                borderRadius: 3,
                            }}
                            position={"relative"}
                        >
                            <SelectedListItem
                                stashTabs={stashTabs}
                                selectedIndex={selectedStashIndex}
                                clickHandler={handleListItemClick}
                            />
                        </Box>
                    </Box>
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
                        {generateRenderedItems(items, selectedStash)}
                    </Box>
                </Box>
                <Box>
                    <TextField
                        label="Account Name"
                        variant="filled"
                        sx={{ backgroundColor: "#005B41" }}
                        onChange={handleTextFieldChange}
                    />
                    <Button
                        sx={{ width: 100, height: 50 }}
                        variant="contained"
                        onClick={handleClick}
                    >
                        Load
                    </Button>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;

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

        result.push(item);
    });

    return result;
};

const generateRenderedItems = (items: Item[], selectedStash: string) => {
    const renderedItem: React.ReactElement[] = [];
    items.forEach((item) => {
        if (item.stash != selectedStash) {
            return;
        }

        let currencyImage = "";
        if (item.priceCurrency == "divine") {
            currencyImage = divineorb;
        } else if (item.priceCurrency == "chaos") {
            currencyImage = chaosorb;
        }

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
                                <Box display={"flex"} justifyContent={"center"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            height: "100",
                                            color: "#E8C872",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography>
                                            {item.priceAmount + "X"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ height: "100%" }}>
                                        <img
                                            width={30}
                                            height={30}
                                            src={currencyImage}
                                        ></img>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            height: "100",
                                            color: "#E8C872",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography>
                                            {item.priceCurrency + " orb"}
                                        </Typography>
                                    </Box>
                                </Box>
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
