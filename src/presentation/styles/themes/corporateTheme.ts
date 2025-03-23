import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const corporateTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0052cc',   // ビジネス感のある濃いブルー
    borderRadius: 2,
    colorBgBase: '#ffffff',
    colorTextBase: '#111111',
    colorBgContainer: '#fafafa',
    colorTextHeading: '#000000',
    // ビジネス感を出すならフォントサイズやフォントファミリを変える設定も可
    // e.g. fontSize: 14,
  },
  // 基本はライトアルゴリズム
  algorithm: theme.defaultAlgorithm,
}
