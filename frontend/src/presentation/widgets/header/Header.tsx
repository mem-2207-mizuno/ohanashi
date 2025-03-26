import React from 'react';
import { ThemeSwitcher } from '../../components/theme/ThemeSwitcher';

import { HeaderWrapper } from './HeaderStyle';
import { Typography } from 'antd';

const { Title } = Typography;

export const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <Title style={{ marginBottom: 0 }}>Ohanashi.</Title>
      <ThemeSwitcher />
    </HeaderWrapper>
  );
};
