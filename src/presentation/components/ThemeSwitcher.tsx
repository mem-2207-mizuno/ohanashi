import React, { useContext } from 'react';
import { Select } from 'antd';
import type { ThemeKey } from '../styles/themes';
import { ThemeContext } from '../hooks/useThemeContext';

const THEME_OPTIONS: ThemeKey[] = [
  'default',
  'dark',
  'light',
  'corporate',
  'playful',
];

export const ThemeSwitcher: React.FC = () => {
  const { themeKey, setThemeKey } = useContext(ThemeContext);

  return (
    <Select
      style={{ width: 150 }}
      value={themeKey}
      onChange={(value: ThemeKey) => setThemeKey(value)}
    >
      {THEME_OPTIONS.map((key) => (
        <Select.Option key={key} value={key}>
          {key}
        </Select.Option>
      ))}
    </Select>
  );
};
