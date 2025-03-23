import { defaultTheme } from './defaultTheme'
import { darkTheme } from './darkTheme'
import type { ThemeConfig } from 'antd'
import { lightTheme } from './lightTheme'
import { corporateTheme } from './corporateTheme'
import { playfulTheme } from './playfulTheme'

export const themes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme,
  corporate: corporateTheme,
  playful: playfulTheme,
}

// テーマのキーを型にする
export type ThemeKey = keyof typeof themes

export function getThemeByKey(key: ThemeKey): ThemeConfig {
  return themes[key]
}
