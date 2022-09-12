// https://brianlovin.com/writing/adding-dark-mode-with-next-js
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/cache';
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material';
import store from 'app/store';
import createEmotionCache from 'utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <ReduxProvider store={store}>
      <CacheProvider value={emotionCache}>
        <CssVarsProvider defaultColorScheme="dark">
          <CssBaseline />
          <Component {...pageProps} />
        </CssVarsProvider>
      </CacheProvider>
    </ReduxProvider>
  );
};

export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) => {
  if (process.env.NODE_ENV !== 'production') return;

  window.gtag('event', name, {
    event_category:
      label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  });
};

export default MyApp;
