import type { ThemeConfig } from 'antd'

export const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',   // AntD標準のブルー
    borderRadius: 6,
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
    colorBgContainer: '#ffffff',
    colorTextHeading: '#000000',
  },
  // 明示的にアルゴリズム指定しないと標準のLightが使用される
  // algorithm: theme.defaultAlgorithm,
}
