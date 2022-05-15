# example project-config Tezos

The following project-config was used for [GloGang](https://music.oneof.com/drops/0ec3d70e-64e1-416f-b18d-bfbd3fe3a667/details).

In order to inform layer-cake of your project's particulars, you need to specify a `ProjectConfig`. Of note, are the populations, and layer order, which should match folders in `layer_assets`.

```typescript
const gloConfig: ProjectConfig = {
  name: 'glo-gang',
  upload_images_to_ipfs: true,
  upload_metadata_to_ipfs: true,
  resume_folder: '20211019-18353071',
  metadata_output: ['tezos'],
  metadata_input: {
    name: 'GloGang Genesis',
    symbol: 'GLO',
    description: glo_gang_description,
    minter: 'tz1i8D4DHkuQsGgpxEaHPRsdYtKCFMnmeN6Z',
    creators: ['Casimir Spaul', 'Chief Keef X ColourfulMula', 'Glo Gang Worldwide, Inc'],
    publishers: ['OneOf, Inc.'],
    genres: [`GloGang`, `character`, `profile`],
    tags: [`XTZ`],
    drop_date: `${timestamp}`,
    native_size: '3301x3301',
    more_info_link: 'https://www.oneof.com/drops/c50e7cd5-0f4e-4abb-9b60-effbfb7b8a1d/details',
  },
  image_outputs: [
    { width: 350, height: 350, tag: 'icon', ipfs_tag: 's' },
    { width: 3000, height: 3000, tag: 'image', ipfs_tag: 'l' },
  ],
  anim_outputs: [
    // { width: 500, height: 500, tag: 'rain', background_animation: 'rain' },
  ],
  populations: [
    {
      name: 'glo-gang',
      population_size: 10,
      layer_order: [
        'Backgrounds',
        'Body',
        'Shirt',
        'Clothes',
        'Jersey',
        'Face',
        'Eyes',
        'Browz',
        'Mouth',
        'Glasses',
        'Hats',
      ],
    },
  ],
  collage_outputs: [
    {
      tag: 'collage-4444',
      source_image_type: 'icon',
      columns: 101,
      rows: 44,
      tile_width: 200,
      tile_height: 200,
      max_sheets: 1,
    },
    {
      tag: 'collage-4k',
      source_image_type: 'icon',
      columns: 80,
      rows: 50,
      tile_width: 200,
      tile_height: 200,
      max_sheets: 1,
    },
    {
      tag: 'collage-twitter-1200-675',
      source_image_type: 'icon',
      columns: 5,
      rows: 3,
      tile_width: 225,
      tile_height: 225,
      max_sheets: 20,
    },
    {
      tag: 'collage-twitter-banner-1500-500',
      source_image_type: 'icon',
      columns: 6,
      rows: 2,
      tile_width: 250,
      tile_height: 250,
      max_sheets: 20,
    },
  ],
};

```