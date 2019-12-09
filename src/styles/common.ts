import { css } from 'styled-components';
import * as colors from '@material-ui/core/colors';

import { GLOBAL_FONT } from 'utils/constants';

export default css`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: ${GLOBAL_FONT};
    margin: 0;
    background-color: ${colors.grey[900]};
    color: #fff;
  }
`;
