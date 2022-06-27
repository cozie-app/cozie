// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cozie, a Fitbit Clockface for IEQ and physiological data collection',
  tagline: 'Allows building occupants to provide feedback in real time',
  url: 'https://thepebblesfr.github.io',
  baseUrl: '/cozie/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ThePebblesFr', // Usually your GitHub org/user name.
  projectName: 'cozie', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ThePebblesFr/cozie-website/tree/master/my-website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Cozie',
        logo: {
          alt: 'Cozie Logo',
          src: 'img/favicon.ico',
        },
        items: [
          {
            type: 'doc',
            docId: 'home',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction to cozie',
                to: '/docs/home',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'BUDS Lab',
                href: 'https://www.budslab.org',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Cozie Repo',
                href: 'https://github.com/cozie-app/cozie',
              },
              {
                label: 'Cozie Apple Repo',
                href: 'https://github.com/cozie-app/cozie-apple',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Cozie, National University of Singapore, BUDS Lab. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
