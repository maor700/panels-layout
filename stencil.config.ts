import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  plugins:[
    sass()
  ],
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    }
  ],
};
