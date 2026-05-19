"use client";

import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";

// Theme provider cho dark/light mode
const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
