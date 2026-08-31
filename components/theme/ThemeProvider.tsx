"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "theme";

// Exécuté avant l'hydratation React (injecté côté serveur, hors de l'arbre React
// classique) — évite le flash ET le warning React 19 sur les <script> en composant.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export function ThemeProvider({
    children,
    defaultTheme = "light",
}: {
    children: ReactNode;
    defaultTheme?: Theme;
}) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);

    useServerInsertedHTML(() => (
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    ));

    // Synchronise l'état React avec ce que le script a déjà appliqué au DOM
    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
        const initial =
            stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setThemeState(initial);
    }, []);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.classList.toggle("dark", next === "dark");
        document.documentElement.style.colorScheme = next;
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme doit être utilisé dans un ThemeProvider");
    return ctx;
}