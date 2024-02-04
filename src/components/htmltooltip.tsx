import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
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
