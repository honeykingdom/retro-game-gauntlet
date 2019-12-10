import { css } from 'styled-components';

import { GLOBAL_FONT } from 'utils/constants';

export default css`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: ${GLOBAL_FONT};
    margin: 0;
  }
`;
