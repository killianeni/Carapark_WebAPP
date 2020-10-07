const Fontagon = require('fontagon');

Fontagon({
  files: [
    'src/assets/icons/*.svg'
  ],
  dist: 'src/assets/fonts/Icons/',
  fontName: 'kmap-icons',
  style: 'css',
  classOptions: {
    baseClass: 'kmap-icons',
    classPrefix: 'icon'
  }
}).then(opts => {
  console.log('done! ' ,opts);
}).catch(err => {
  console.log('fail! ', err);
});
