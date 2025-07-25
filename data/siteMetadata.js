/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'ArkoiSystems Blog',
  author: 'Timo Behrend',
  headerTitle: 'ArkoiSystems',
  description: 'A technical blog about the ArkoiSystems project',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://arkoisystems.com',
  siteRepo: 'https://github.com/ArkoiSystems',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'support@arkoisystems.com',
  github: 'https://github.com/ArkoiSystems',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
}

export default siteMetadata
