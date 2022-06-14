export interface OpenSeaStoreInformation {
  name: string;
  description: string;
  image: string;
  external_link: string;
  seller_fee_basis_points: number; // 100 indicates a 1% seller fee.
  fee_recipient: string; // "0x971B4533EdBFcfE34e0F6eA053D33231a814FD96" // Where seller fees will be paid to
}
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
