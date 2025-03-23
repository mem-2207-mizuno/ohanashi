import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#50b5ff',    // もう少し明るいブルーに
    borderRadius: 8,
    colorBgBase: '#fefefe',     // 真っ白よりやや淡いトーン
    colorTextBase: '#222222',
    colorBgContainer: '#fdfdfd',
    colorTextHeading: '#333333',
    // 他に色をパステル系に寄せたい場合はさらにトークン追加
  },
  // Lightアルゴリズムを明示してもOK
  algorithm: theme.defaultAlgorithm,
}
