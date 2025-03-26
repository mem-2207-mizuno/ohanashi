import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const playfulTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ff5c5c',  // 赤ピンク系ポップなカラー
    borderRadius: 12,        // 丸みを強調
    colorBgBase: '#fff7f7',  // 若干ピンクがかった背景
    colorTextBase: '#663333',
    colorTextHeading: '#cc0000',
    // 他にも遊び心あるカラーを追加...
  },
  algorithm: theme.defaultAlgorithm, // or no algorithm specified
}