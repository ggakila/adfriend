/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react/prop-types
export function ThemeProvider({ children }) {
	const [themeColor, setThemeColor] = useState(() => {
		return localStorage.getItem("themeColor") || "purple";
	});

	useEffect(() => {
		localStorage.setItem("themeColor", themeColor);
	}, [themeColor]);

	return (
		<ThemeContext.Provider value={{ themeColor, setThemeColor }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
