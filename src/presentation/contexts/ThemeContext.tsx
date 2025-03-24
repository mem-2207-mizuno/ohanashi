import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';

import { getThemeByKey, ThemeKey } from '../styles/themes';
import { ThemeContext } from '../hooks/useThemeContext';

type Props = {
  children: React.ReactNode;
};

// Provider: 実際にアンチョコとして使用
export const ThemeProvider: React.FC<Props> = ({ children }) => {
  // デフォルトテーマを "default" にしている例
  const [themeKey, setThemeKey] = useState<ThemeKey>('default');

  // 選択されたテーマ設定を取得
  const themeConfig: ThemeConfig = getThemeByKey(themeKey);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey }}>
      <ConfigProvider theme={themeConfig}>
        <div
          style={{
            minHeight: '100vh',
            minWidth: '100vw',
            backgroundColor: themeConfig.token?.colorBgBase,
            padding: themeConfig.token?.padding,
            borderRadius: themeConfig.token?.borderRadius,
            color: themeConfig.token?.colorPrimaryText,
            fontSize: themeConfig.token?.fontSize,
          }}
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
