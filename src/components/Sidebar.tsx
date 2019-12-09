import styled from 'styled-components';

const LinksRoot = styled.aside`
  display: flex;
  flex-direction: column;

  & > :not(:last-child) {
    margin-bottom: 32px;
  }
`;

export default LinksRoot;
