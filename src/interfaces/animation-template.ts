export enum AnimationTemplate {
  TOKEN = `token`,
  MUSIC_SINGLE = `music_single`,
  MUSIC_ALBUM = `music_album`,
  MUSIC_GENERATIVE = `music_generative`,
  MEMBERSHIP = `membership`,
}

export const templatePaths = new Map<AnimationTemplate, string>([
  [AnimationTemplate.TOKEN, './src/template/token'],
  [AnimationTemplate.MUSIC_SINGLE, ''],
  [AnimationTemplate.MUSIC_ALBUM, ''],
  [AnimationTemplate.MUSIC_GENERATIVE, ''],
  [AnimationTemplate.MEMBERSHIP, ''],
]);
