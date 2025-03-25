import React from 'react';
import { ThemeSwitcher } from '../../components/theme/ThemeSwitcher';

import { HeaderWrapper } from './HeaderStyle';

export const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <ThemeSwitcher />
    </HeaderWrapper>
  );
};
