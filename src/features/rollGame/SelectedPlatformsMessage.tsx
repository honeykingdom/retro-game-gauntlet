import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { Typography } from '@material-ui/core';

import replaceSpacesWithNbsp from 'utils/replaceSpacesWithNbsp';
import { selectedPlatformIdsSelector } from 'features/options/optionsSlice';

import platforms from 'data/platforms.json';

const SelectedPlatformsMessage = () => {
  const selectedPlatformIds = useSelector(selectedPlatformIdsSelector);

  if (!selectedPlatformIds.length) {
    return (
      <Typography variant="h6">Please choose one or more platfotms</Typography>
    );
  }

  if (selectedPlatformIds.length === platforms.length) {
    return (
      <Typography variant="h6" color="textSecondary">
        Selected&nbsp;platforms:{' '}
        <Typography variant="inherit" color="textPrimary">
          All
        </Typography>
      </Typography>
    );
  }

  const selectedPlatforms = selectedPlatformIds
    .slice(0, 3)
    .map((id) => platforms.find(R.propEq('id', id)));

  if (selectedPlatformIds.length === 1) {
    return (
      <Typography variant="h6" color="textSecondary">
        Selected&nbsp;platform:{' '}
        <Typography
          variant="inherit"
          color="textPrimary"
          dangerouslySetInnerHTML={{
            __html: replaceSpacesWithNbsp(selectedPlatforms[0]?.name || ''),
          }}
        />
      </Typography>
    );
  }

  return (
    <Typography variant="h6" color="textSecondary">
      Selected&nbsp;platforms:{' '}
      {selectedPlatforms.map((platform, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          <Typography
            variant="inherit"
            color="textPrimary"
            key={platform?.id}
            dangerouslySetInnerHTML={{
              __html: replaceSpacesWithNbsp(platform?.name || ''),
            }}
          />
          {selectedPlatforms.length - 1 !== index && ', '}
        </React.Fragment>
      ))}
      {selectedPlatformIds.length > 3 && (
        <>
          {' and'}&nbsp;
          <Typography variant="inherit" color="textPrimary">
            {selectedPlatformIds.length - 3}
          </Typography>
          &nbsp;more
        </>
      )}
    </Typography>
  );
};

export default SelectedPlatformsMessage;
