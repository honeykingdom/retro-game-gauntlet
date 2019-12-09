import React from 'react';
import styled from 'styled-components';
import * as colors from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';

const HeaderRoot = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.grey[800]};
  color: #fff;
`;

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  return (
    <HeaderRoot className={className}>
      <Typography variant="h4">Retro Game Gauntlet</Typography>
    </HeaderRoot>
  );
};

export default Header;
