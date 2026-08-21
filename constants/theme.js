import { Platform } from 'react-native';

const headingFont = Platform.OS === 'web' ? 'Playfair Display' : 'System';
const bodyFont = Platform.OS === 'web' ? 'Outfit' : 'System';

export const lightTheme = {
  colors: {
    background: "#F8F9FA",
    surface: "#FFFFFF",
    primary: "#070262", // Deep Indigo Navy
    primaryDark: "#0F0785",
    primaryLight: "#EEF2F6",
    accent: "#FBBF24", // Gold
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    divider: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  spacing: {
    grid: 8,
    gap: 16,
    padding: 24,
    cardGap: 24,
    sectionGap: 32,
    margin: 32,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    input: 8,
    button: 8,
    card: 12,
    header: 0,
    badge: 100,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: "700", color: "#1F2937", fontFamily: headingFont },
    h2: { fontSize: 20, fontWeight: "600", color: "#1F2937", fontFamily: headingFont },
    h3: { fontSize: 16, fontWeight: "600", color: "#1F2937", fontFamily: headingFont },
    body: { fontSize: 14, fontWeight: "500", color: "#1F2937", fontFamily: bodyFont },
    caption: { fontSize: 12, fontWeight: "400", color: "#6B7280", fontFamily: bodyFont },
  },
  elevation: {
    soft: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    }
  }
};

export const darkTheme = {
  colors: {
    background: "#000000", // Pure Black
    surface: "#121212", // Pure dark card
    primary: "#1a1a1a", // Dark charcoal primary
    primaryDark: "#0A0A0A",
    primaryLight: "#1F1F1F",
    accent: "#FBBF24", // Same gold accent
    text: "#F9FAFB", // High contrast white text
    textSecondary: "#9CA3AF", // Soft light gray
    border: "#2D2D2D",
    divider: "#1E1E1E",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: {
    h1: { fontSize: 24, fontWeight: "700", color: "#F9FAFB", fontFamily: headingFont },
    h2: { fontSize: 20, fontWeight: "600", color: "#F9FAFB", fontFamily: headingFont },
    h3: { fontSize: 16, fontWeight: "600", color: "#F9FAFB", fontFamily: headingFont },
    body: { fontSize: 14, fontWeight: "500", color: "#F9FAFB", fontFamily: bodyFont },
    caption: { fontSize: 12, fontWeight: "400", color: "#9CA3AF", fontFamily: bodyFont },
  },
  elevation: {
    soft: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    }
  }
};

export const crimsonTheme = {
  colors: {
    background: "#FAF5F5", // Soft rose-white light background
    surface: "#FFFFFF",
    primary: "#990000", // Crimson Red primary color
    primaryDark: "#7A0000",
    primaryLight: "#FFEAEA",
    accent: "#FBBF24", // Same gold accent
    text: "#2D1818",
    textSecondary: "#7A6666",
    border: "#F3E4E4",
    divider: "#FAF0F0",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: {
    h1: { fontSize: 24, fontWeight: "700", color: "#2D1818", fontFamily: headingFont },
    h2: { fontSize: 20, fontWeight: "600", color: "#2D1818", fontFamily: headingFont },
    h3: { fontSize: 16, fontWeight: "600", color: "#2D1818", fontFamily: headingFont },
    body: { fontSize: 14, fontWeight: "500", color: "#2D1818", fontFamily: bodyFont },
    caption: { fontSize: 12, fontWeight: "400", color: "#7A6666", fontFamily: bodyFont },
  },
  elevation: lightTheme.elevation
};

export const ivoryTheme = {
  colors: {
    background: "#F8F5EE", // Warm Ivory
    surface: "#FFFDF8", // Panel / Card White
    primary: "#30281F", // Primary Text / Deep Brown
    primaryDark: "#1F1A14",
    primaryLight: "#F1EADF", // Soft Beige Surface
    accent: "#AD7A2E", // Muted Gold Accent
    text: "#30281F", // Primary Text / Deep Brown
    textSecondary: "#81776A", // Muted Text / Taupe
    border: "#E7DFD1", // Border / Soft Beige
    divider: "#F1EADF",
    success: "#4E7657", // Positive Green
    warning: "#D0A04D", // Highlight Gold
    danger: "#A85A4C", // Warning Red
    cadWall: "#302A24", // CAD Wall Color
    cadWindow: "#568095", // CAD Window Color
    vastuCenter: "#F0E4CC", // Vastu Center Highlight
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
  typography: {
    h1: { fontSize: 24, fontWeight: "700", color: "#30281F", fontFamily: headingFont },
    h2: { fontSize: 20, fontWeight: "600", color: "#30281F", fontFamily: headingFont },
    h3: { fontSize: 16, fontWeight: "600", color: "#30281F", fontFamily: headingFont },
    body: { fontSize: 14, fontWeight: "500", color: "#30281F", fontFamily: bodyFont },
    caption: { fontSize: 12, fontWeight: "400", color: "#81776A", fontFamily: bodyFont },
  },
  elevation: lightTheme.elevation
};

// Legacy fallback export to avoid import syntax crashes in existing files
export const theme = lightTheme;
