export enum Type {
  IMAGE = 'Image',
  VIDEO = 'Video',
}

export interface OpenSeaStoreInformation {
  name: string;
  description: string;
  image: string;
  external_link: string;
  seller_fee_basis_points: number; // 100 indicates a 1% seller fee.
  fee_recipient: string; // "0x971B4533EdBFcfE34e0F6eA053D33231a814FD96" // Where seller fees will be paid to
}

export interface Metadata {
  dna?: string;
  date?: string;
  birthday?: string;
  // edition: Edition;
  // minter: typeof Minter;
  symbol: string;
  creator: string;
  authors: string[] | string;
  background_colors: string[];
  image: string;
  icon?: string;
  thumbnail?: string;
  description?: string;
  // additiona_metadata?: string;
}

export type Extra_Metadata = {};

/*
 * @dev Tezo TZIP 16, 12, 21 interface definitions for NFTs
 */
export const TZIP_Interfaces: string[] = ['TZIP-007-2021-04-17', 'TZIP-016-2021-04-17'];

export interface XTZ_Metadata {
  interfaces?: string[];
  decimals?: string;
  tags?: string[] | string;
  langauge?: string; // 'en'
  artifactUri?: string;
  displayUri?: string;
  thumbnailUri?: string;
  externalUri: string;
}
