const secondsToSpinMarks = [...Array(6)].map((_, i) => ({
  value: (i + 1) * 10,
  label: (i + 1) * 10,
}));

const speedMarks = [...Array(8)].map((_, i) => ({
  value: i + 1,
  label: i + 1,
}));

const numberOfGamesMarks = [2, 4, 6, 8, 10, 12, 14, 16].map((n) => ({
  value: n,
  label: n,
}));

const options = [
  {
    id: 'secondsToSpin',
    title: 'Seconds to Spin',
    component: {
      type: 'slider',
      step: 1,
      min: 10,
      max: 60,
      marks: secondsToSpinMarks,
    },
  },
  {
    id: 'speed',
    title: 'Speed',
    component: {
      type: 'slider',
      step: 1,
      min: 1,
      max: 8,
      marks: speedMarks,
    },
  },
  {
    id: 'numberOfGames',
    title: 'Number of Games',
    component: {
      type: 'slider',
      step: 1,
      min: 2,
      max: 16,
      marks: numberOfGamesMarks,
    },
  },
];

export default options;
