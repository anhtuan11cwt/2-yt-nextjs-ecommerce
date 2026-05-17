"use client";

import { CssBaseline } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@teispace/next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// Kiểm tra hydration để tránh mismatch MUI theme
function useHydrated() {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}

// Wrapper cung cấp MUI theme theo dark/light mode
export default function DataTableWrapper({ children }) {
	const { resolvedTheme } = useTheme();
	const hydrated = useHydrated();

	const muiTheme = createTheme({
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					html: {
						fontFamily: "inherit",
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: "none",
					},
				},
			},
			MuiTableCell: {
				styleOverrides: {
					root: {
						borderColor: resolvedTheme === "dark" ? "#27272a" : "#e4e4e7",
					},
				},
			},
			MuiTableHead: {
				styleOverrides: {
					root: {
						borderColor: resolvedTheme === "dark" ? "#27272a" : "#e4e4e7",
					},
				},
			},
			MuiTablePagination: {},
		},
		palette: {
			mode: resolvedTheme === "dark" ? "dark" : "light",
			...(resolvedTheme === "dark"
				? {
						background: {
							default: "#09090b",
							paper: "#09090b",
						},
					}
				: {
						background: {
							default: "#ffffff",
							paper: "#ffffff",
						},
					}),
		},
		typography: {
			fontFamily: "inherit",
		},
	});

	if (!hydrated) return null;

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline />
			<div className="overflow-x-auto">{children}</div>
		</ThemeProvider>
	);
}
