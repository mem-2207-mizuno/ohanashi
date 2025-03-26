import { createContext, useContext } from 'react';
import { ThemeKey } from '../styles/themes';

interface ThemeContextValue {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  themeKey: 'default',
  setThemeKey: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);
