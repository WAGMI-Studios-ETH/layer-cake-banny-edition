export type Resolution = {
  type: string;
  width: number;
  height: number;
};

export type Resolutions = Resolution[];

export const icon: Resolution = { type: 'icon', width: 300, height: 300 };
export const image: Resolution = { type: 'image', width: 3000, height: 3000 };
export const thumbnail: Resolution = { type: 'thumbnail', width: 500, height: 500 };
export const large_format: Resolution = { type: 'large_format', width: 6000, height: 6000 };
export const contact_sheet: Resolution = { type: 'contact_sheet', width: 9000, height: 9000 };
