import { createTheme } from "@mui/material";

// Theme takes in boolean parameter to determine if we use dark or light mode
export const appTheme = (lightMode: boolean) => createTheme({
    palette: {
        mode: lightMode ? "light" : "dark",

        primary: {
            main: "#064E3B",
            contrastText: "#F8E7C9"
        },

        background: {
            default:
                lightMode ? "#f8e7c9" : "#27272A",
            paper:
                lightMode ? "#fcedd5" : "#27272A"
        },

        text: {
            primary:
                lightMode ? "#132A22" : "#F8E7C9",
            secondary:
                lightMode ? "#4B635A" : "#D4D4D8"
        }
    }
})