import * as R from 'ramda';
import { shuffle } from 'd3-array';

import { RolledGame } from 'features/rollGame/rollGameTypes';

import games from 'data/games.json';
import platforms from 'data/platforms.json';

export const getRandomGames = (
  selectedPlatformIds: string[],
  count: number,
): RolledGame[] => {
  const gamesBySelectedPlatforms = selectedPlatformIds.length
    ? R.pick(selectedPlatformIds, games)
    : games;

  const rolledGames = R.pipe<any, any, any, any, any, any>(
    R.toPairs,
    R.map<any, any>(([platformId, items]) =>
      R.map((name) => ({ platformId, name }), items),
    ),
    R.flatten,
    shuffle,
    R.slice(0, count),
  )(gamesBySelectedPlatforms);

  return rolledGames.map(({ platformId, ...rest }: any) => {
    const platform = platforms.find(R.propEq('id', platformId));

    return {
      platform: platform?.name || '',
      ...rest,
    };
  });
};

export const gamesCount = R.pipe<any, any, any, any>(
  R.values,
  R.flatten,
  R.propOr(0, 'length'),
)(games) as number;

// longest game names
// console.log(
//   R.pipe<any, any, any, any, any>(
//     R.values,
//     R.flatten,
//     R.sortWith([R.descend(R.prop("length"))]),
//     R.slice(0, 10)
//   )(games)
// );
