import { OpenSeaStoreInformation } from '../interfaces';
import { MEOWSDAO_GNOSIS_SAFE } from './index';

export const opensea_store_information: OpenSeaStoreInformation = {
  name: 'Mr, Whiskers Genesis Collection',
  description: '',
  image: 'https://openseacreatures.io/image.png',
  external_link: 'https://openseacreatures.io',
  seller_fee_basis_points: 250, // Indicates a 1% seller fee.
  fee_recipient: `${MEOWSDAO_GNOSIS_SAFE}`, // Where seller fees will be paid to
};
