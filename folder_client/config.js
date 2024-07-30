import getConfig from "next/config.js";
const { publicRuntimeConfig } = getConfig();

export const API = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.API_DEV
  : publicRuntimeConfig.API_PROD;

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.DOMAIN_PROD
  : publicRuntimeConfig.DOMAIN_DEV;
