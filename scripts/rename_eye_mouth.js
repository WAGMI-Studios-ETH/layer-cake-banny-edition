const fs = require('fs');

function getPath(path) {
  return require('path').resolve(__dirname, '..', path);
}

const characters = fs.readdirSync(getPath('./layered-assets/vebanny')).filter(ch => ch.startsWith('Character_'));

const faceDirs = characters.map(ch => getPath(`./layered-assets/vebanny/${ch}/Traits/Face/`));

const eyeMouth = faceDirs.map(dir => `${dir}/Eye_Mouth.png`).filter(path => fs.existsSync(path));

eyeMouth.forEach(file => fs.renameSync(file, file.replace('Eye_Mouth', 'Original')));
console.log(eyeMouth);
