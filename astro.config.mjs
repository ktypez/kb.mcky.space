import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebar from './src/data/sidebar.json';
import starlightThemeBlack from 'starlight-theme-black';

export default defineConfig({
  output: 'static',
  integrations: [
    starlight({
      title: 'OKF Knowledge Base',
      description: 'Open Knowledge Framework — structured context for every project',
      sidebar,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ktypez/OKF' },
      ],
      plugins: [
        starlightThemeBlack({
          footerText:
            'Built & designed by [shadcn](https://twitter.com/shadcn). Ported to Astro Starlight by [Adrián UB](https://github.com/adrian-ub).',
        }),
      ],
    }),
  ],
});
