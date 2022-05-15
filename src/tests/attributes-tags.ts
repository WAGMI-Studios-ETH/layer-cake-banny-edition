import { logger } from '../utils';

const metadata = {
  attributes: {
    Backgrounds: 'PinkGlazeCamo',
    Body: 'ChainGrey',
    Shirt: 'ArmyWhiteCamo',
    Clothes: 'IconicGlo',
    Jersey: 'GloSuns',
    Face: 'MonoRoja',
    Eyes: 'BloodShot',
    Browz: 'OrangeGlo',
    Mouth: 'SuperDuperSmile',
    Glasses: 'GloryBoy',
    Hats: 'SmokePuff',
  },
};

(async () => {
  
  const tags: string[] = [];
  Object.keys(metadata.attributes).map((a: string) => tags.push(a));
  Object.values(metadata.attributes).map((a: string) => tags.push(a));
  logger.info(`${tags}`);
  
})();
