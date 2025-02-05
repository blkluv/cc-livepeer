const APP_NAME = 'ARVRtise NFTV'
const APP_DESCRIPTION = 'A decentralized video sharing platform'
const APP_VERSION = '0.0.1'
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
const LIVEPEER_KEY = process.env.NEXT_PUBLIC_LIVEPEER_KEY;
const GRAPHQL_URI = "https://api.cyberconnect.dev/testnet/"
const ESSENCE_APP_ID = "cyberconnect-livepeer";
const DOMAIN = "nftv.arvrtise.com"; // Domain name
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'CC_REFRESH_TOKEN'
const WALLET_KEY = 'address'
const MIN_MINT_PRICE = 0.01;
const MAX_MINT_PRICE = 10000000;
const BUSD_CONTRACT_ADDRESS = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
export {
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  IPFS_GATEWAY,
  GRAPHQL_URI,
  LIVEPEER_KEY,
  ESSENCE_APP_ID,
  DOMAIN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  WALLET_KEY,
  MIN_MINT_PRICE,
  MAX_MINT_PRICE,
  BUSD_CONTRACT_ADDRESS
}
