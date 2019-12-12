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

  const selectedPlatformsText = (
    <>Selected&nbsp;platform{selectedPlatformIds.length === 1 ? '' : 's'}: </>
  );

  const renderSelectedPlatformsList = () => {
    if (selectedPlatformIds.length === platforms.length) {
      return (
        <Typography variant="inherit" color="textPrimary">
          All
        </Typography>
      );
    }

    const selectedPlatforms = selectedPlatformIds
      .slice(0, 3)
      .map((id) => platforms.find(R.propEq('id', id))) as typeof platforms;

    const selectedPlatformsList = selectedPlatforms.map(
      ({ id, name }, index) => (
        <React.Fragment key={id}>
          <Typography
            variant="inherit"
            color="textPrimary"
            dangerouslySetInnerHTML={{
              __html: replaceSpacesWithNbsp(name),
            }}
          />
          {selectedPlatforms.length - 1 !== index && ', '}
        </React.Fragment>
      ),
    );

    const renderPlatformsMoreText = () => (
      <>
        {' and'}&nbsp;
        <Typography variant="inherit" color="textPrimary">
          {selectedPlatformIds.length - 3}
        </Typography>
        &nbsp;more
      </>
    );

    return (
      <>
        {selectedPlatformsList}
        {selectedPlatformIds.length > 3 && renderPlatformsMoreText()}
      </>
    );
  };

  return (
    <Typography variant="h6" color="textSecondary">
      {selectedPlatformsText}
      {renderSelectedPlatformsList()}
    </Typography>
  );
};

export default SelectedPlatformsMessage;
