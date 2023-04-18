import { Config } from 'src/assets/Config';

export const environment = {
  production: true,
  apiurl: `${Config.getHttp()}://${Config.getDomain()}/api/`,
  apiurlHoaDon: `${Config.getHttp()}://${Config.getDomainHoaDon()}/api/`,
};
