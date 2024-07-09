import getConfig from "next/config.js";
const {publicRuntimeConfig} = getConfig();

export const API = publicRuntimeConfig.PRODUCTION
  ? "https://blogged.com"
  : "http://localhost:8000/api";
export const APP_NAME = publicRuntimeConfig.APP_NAME;
