import React from 'react';
import * as R from 'ramda';
import { Typography } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import replaceSpacesWithNbsp from 'utils/replaceSpacesWithNbsp';
import platforms from 'data/platforms.json';
import { selectedPlatformsSelector } from '../rollGameSlice';

const SelectedPlatformsMessage = () => {
  const selectedPlatforms = useAppSelector(selectedPlatformsSelector);

  if (!selectedPlatforms.length) {
    return (
      <Typography variant="h6">Please choose one or more platforms</Typography>
    );
  }

  const selectedPlatformsText = (
    <>Selected&nbsp;platform{selectedPlatforms.length === 1 ? '' : 's'}: </>
  );

  const renderSelectedPlatformsList = () => {
    if (selectedPlatforms.length === platforms.length) {
      return (
        <Typography variant="inherit" color="textPrimary" component="span">
          All
        </Typography>
      );
    }

    const selected = selectedPlatforms
      .slice(0, 3)
      .map((id) => platforms.find(R.propEq('id', id))) as typeof platforms;

    const selectedPlatformsList = selected.map(({ id, name }, index) => (
      <React.Fragment key={id}>
        <Typography
          variant="inherit"
          color="textPrimary"
          component="span"
          dangerouslySetInnerHTML={{
            __html: replaceSpacesWithNbsp(name),
          }}
        />
        {selected.length - 1 !== index && ', '}
      </React.Fragment>
    ));

    const renderPlatformsMoreText = () => (
      <>
        {' and'}&nbsp;
        <Typography variant="inherit" color="textPrimary" component="span">
          {selectedPlatforms.length - 3}
        </Typography>
        &nbsp;more
      </>
    );

    return (
      <>
        {selectedPlatformsList}
        {selectedPlatforms.length > 3 && renderPlatformsMoreText()}
      </>
    );
  };

  return (
    <Typography variant="h6" color="textSecondary" component="span">
      {selectedPlatformsText}
      {renderSelectedPlatformsList()}
    </Typography>
  );
};

export default SelectedPlatformsMessage;
