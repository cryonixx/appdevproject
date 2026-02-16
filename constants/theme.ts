/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";
const bordercolorLight = "#EFEFF0";
const bordercolorDark = "#1C1C1E";

const tintColorLight = "#151718";
const tintColorDark = "#FAFAFA";
const LIGHT_AVAILABLE_COLORS = [
  "#666666", // Grey
  "#b7d5ee", // Blue
  "#efa4b0", // Red
  "#a7deb4", // Green
  "#fdf1af", // Yellow
  "#e6acf1", // Purple
];

const DARK_AVAILABLE_COLORS = [
  "#999999", // Grey (Lighter than original so it doesn't vanish into a dark background)
  "#6592BC", // Blue (Deeper, calming ocean blue)
  "#C16878", // Red (Muted rose/crimson)
  "#5F9E72", // Green (Rich, earthy mint)
  "#C2B363", // Yellow (Muted gold/mustard)
  "#A96DB5", // Purple (Deep lavender)
];

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FAFAFA",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#FAFAFA",
    tabIconSelected: tintColorLight,
    bordercolorSelected: bordercolorLight,
    container: "#EFEFF0",
    lightext: "#AFB1B6",
    available_colors: LIGHT_AVAILABLE_COLORS,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#151718",
    tabIconSelected: tintColorDark,
    bordercolorSelected: bordercolorDark,
    container: "#202020",
    lightext: "#646464",
    available_colors: DARK_AVAILABLE_COLORS,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
