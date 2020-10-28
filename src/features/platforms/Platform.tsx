import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import * as colors from '@material-ui/core/colors';

type Props = {
  id: string;
  name: string;
  // eslint-disable-next-line react/no-unused-prop-types
  releaseDate: string;
  gamesCount: number;
  checked: boolean;
  onNameClick: (id: string) => void;
  onCheckboxClick: (id: string) => void;
};

const Platform = ({
  id,
  name,
  gamesCount,
  checked,
  onNameClick,
  onCheckboxClick,
}: Props) => (
  <ListItem
    key={id}
    button
    selected={checked}
    style={{ padding: '0 12px', alignItems: 'stretch' }}
  >
    <Checkbox
      edge="start"
      color="default"
      checked={checked}
      style={{ padding: 4 }}
      onChange={() => onCheckboxClick(id)}
    />
    <ListItemText
      id={id}
      primary={name}
      primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
      style={{ margin: 0, display: 'flex', alignItems: 'center' }}
      secondary={`(${gamesCount} games)`}
      secondaryTypographyProps={{
        style: { display: 'inline', marginLeft: 4, color: colors.grey[500] },
      }}
      onClick={() => onNameClick(id)}
    />
  </ListItem>
);

export default React.memo(Platform);
