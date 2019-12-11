import ReactGA from 'react-ga';

const CATEGORIES = {
  rollGame: 'Roll Game',
  searchLinks: 'Search Links',
  platforms: 'Platforms',
  userInterface: 'User Interface',
};

const initialize = () => ReactGA.initialize('UA-139550930-4');

const pageview = (page: string) => ReactGA.pageview(page);

const sendEvent = (eventArgs: ReactGA.EventArgs) => {
  if (process.env.NODE_ENV !== 'production') {
    // console.log(eventArgs);
  } else {
    ReactGA.event(eventArgs);
  }
};

const event = {
  rollGame: {
    start: () =>
      sendEvent({
        category: CATEGORIES.rollGame,
        action: 'Start',
      }),
    complete: () =>
      sendEvent({
        category: CATEGORIES.rollGame,
        action: 'Complete',
      }),
  },

  // search links
  searchLink: (serviceId: string) =>
    sendEvent({
      category: CATEGORIES.searchLinks,
      action: 'Search Link Click',
      label: serviceId,
    }),

  // platforms
  platforms: {
    selectAll: () =>
      sendEvent({
        category: CATEGORIES.platforms,
        action: 'Select All Click',
      }),
    selectNone: () =>
      sendEvent({
        category: CATEGORIES.platforms,
        action: 'Select None Click',
      }),
    platformNameClick: (platformId: string) =>
      sendEvent({
        category: CATEGORIES.platforms,
        action: 'Platform Name Click',
        label: platformId,
      }),
    platformCheckboxClick: (platformId: string) =>
      sendEvent({
        category: CATEGORIES.platforms,
        action: 'Platform Checkbox Click',
        label: platformId,
      }),
  },

  // user interface
  ui: {
    platforms: (isVisible: boolean) =>
      sendEvent({
        category: CATEGORIES.userInterface,
        action: 'Platforms',
        label: isVisible ? 'Show' : 'Hide',
      }),
    options: (isVisible: boolean) =>
      sendEvent({
        category: CATEGORIES.userInterface,
        action: 'Options',
        label: isVisible ? 'Show' : 'Hide',
      }),
    changeOption: (name: string, value: number) =>
      sendEvent({
        category: CATEGORIES.userInterface,
        action: 'Change Option',
        label: name,
        value,
      }),
    link: (url: string) =>
      sendEvent({
        category: CATEGORIES.userInterface,
        action: 'Link',
        label: url,
      }),
  },
};

export default {
  initialize,
  pageview,
  event,
};
