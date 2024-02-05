import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

type ClickHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
) => void;

type Props = {
    stashTabs: string[];
    selectedIndex: number;
    clickHandler: ClickHandler;
};

export default function SelectedListItem(props: Props) {
    return (
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <List component="nav" aria-label="secondary mailbox folder">
                {props.stashTabs.map((stashTab, index) => (
                    <ListItemButton
                        selected={props.selectedIndex === index}
                        key={stashTab + index}
                        onClick={(event) => props.clickHandler(event, index)}
                    >
                        <ListItemText primary={stashTab} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
