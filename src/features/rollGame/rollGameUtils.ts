import { shuffle } from 'd3-array';
import { RolledGame } from 'features/rollGame/rollGameTypes';
import games from 'data/games.json';
import platforms from 'data/platforms.json';

type Game = {
  name: string;
  platformId: string;
  platformName: string;
};
type Platform = typeof platforms[number];

const platformsMap: Record<string, Platform> = {};

for (const platform of platforms) {
  platformsMap[platform.id] = platform;
}

const gamesList: Game[] = [];

for (const [platformId, platformGames] of Object.entries(games)) {
  for (const name of platformGames) {
    const platformName = platformsMap[platformId].name;
    gamesList.push({ name, platformId, platformName });
  }
}

export const getRandomGames = (
  selectedPlatforms: string[],
  count: number,
): RolledGame[] => {
  const platformIds =
    selectedPlatforms.length > 0 ? selectedPlatforms : Object.keys(games);
  const gamesByPlatforms = gamesList.filter((game) =>
    platformIds.includes(game.platformId),
  );

  return shuffle(gamesByPlatforms)
    .slice(0, count)
    .map(({ name, platformName: platform }) => ({ name, platform }));
};

export const gamesCount = gamesList.length;

// longest game names
// console.log(
//   R.pipe<any, any, any, any, any>(
//     R.values,
//     R.flatten,
//     R.sortWith([R.descend(R.prop("length"))]),
//     R.slice(0, 10)
//   )(games)
// );
