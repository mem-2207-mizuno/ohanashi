import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const darkTheme: ThemeConfig = {
  // Ant Design v5のdarkアルゴリズムを使う
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#57d9a3',   // ダークでも映えるグリーン系
    borderRadius: 4,
    // darkAlgorithmでデフォルトのダーク配色が当たるので、
    // 必要に応じて上書きトークンを加える。
    colorBgBase: '#1f1f1f',
    colorTextBase: '#e2e2e2',
    colorTextHeading: '#ffffff',
  },
}
