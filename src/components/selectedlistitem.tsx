import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

type ClickHandler = (index: number, name: string) => void;

type Props = {
    stashTabs: string[];
    selectedIndex: number;
    clickHandler: ClickHandler;
};

export default function SelectedListItem(props: Props) {
    return (
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "#005B41" }}>
            <List component="nav" aria-label="secondary mailbox folder">
                {props.stashTabs.map((stashTab, index) => (
                    <ListItemButton
                        selected={props.selectedIndex === index}
                        key={stashTab + index}
                        onClick={() => props.clickHandler(index, stashTab)}
                    >
                        <ListItemText primary={stashTab} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
