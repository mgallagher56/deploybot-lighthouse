module.exports = {
    extends: 'lighthouse:default',
    settings: {
      skipAudits: [
        'full-page-screenshot',
        'screenshot-thumbnails',
        'final-screenshot',
      ],
    },
  };