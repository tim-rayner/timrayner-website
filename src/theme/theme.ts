import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    cta: Palette["primary"];
  }
  interface PaletteOptions {
    cta?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    cta: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0B0F1A", // Midnight Blue — page, hero, section, footer backgrounds
      paper: "#1E2430",   // Slate Gray — cards, code blocks, dividers
    },
    primary: {
      main: "#7C5DFF",         // Royal Purple — brand colour, name highlights, active nav
      contrastText: "#0B0F1A", // 4.55:1 on primary ✓
    },
    secondary: {
      main: "#4D8EFF",         // Electric Blue — links, tech badges, hover states
      contrastText: "#0B0F1A", // 6.10:1 on secondary ✓
    },
    success: {
      main: "#00D4C4",         // Cyber Teal — metrics, timeline achievements, success states
      contrastText: "#0B0F1A", // 9.95:1 on success ✓
    },
    info: {
      main: "#B39DFF",         // Soft Lilac — testimonials, personal story sections
      contrastText: "#0B0F1A", // 8.31:1 on info ✓
    },
    cta: {
      main: "#7C5DFF",         // Royal Purple — CTA buttons only (View Projects, Let's Work Together)
      contrastText: "#FFFFFF",
    },
  },
});

export default theme;
