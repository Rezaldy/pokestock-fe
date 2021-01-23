import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { boot } from 'quasar/wrappers';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.withCredentials = true;
  // @ts-ignore-next-line
  axios.interceptors.response.use((response: AxiosResponse) => {

  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios.create({
    baseURL: process.env.API,
  });
});
