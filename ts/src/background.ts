import Keycloak from 'keycloak-js';
import axios, { AxiosRequestConfig } from 'axios';
// set up common
import {localStorageV, StoreKey} from "./local-storage";
// set up common

// for production
const fullURL = window.location.href
const domainRegex = new RegExp('.phanmemvet.vn(.*)', 'g');
const  storedCorporate = fullURL.replace(domainRegex, '')
    .replace(/localhost(.*)/g, '')
    .replace(/^http(.*):\/\//g, '')
    .replace(/\./g, '');
console.log( "brand id: " +  storedCorporate);
let realm  = 'vetgo';
if (storedCorporate) {
    realm = storedCorporate;
}
const keycloak = new Keycloak({
    url: 'https://keycloak.phanmemvet.vn',
    realm: realm,
    clientId: 'frontend'
});
setTimeout(async () => {
    try {
        console.log("User is authenticated");
      const authenticated =  await keycloak.init({ onLoad: 'login-required' });
      if(authenticated) {
          console.log(keycloak);
          console.log(keycloak.token);
          localStorageV.setItem(StoreKey.keyLockToken,keycloak.token);
      }
    } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }
})

// intercept
const instance = axios.create();
// Tạo một interceptor để thêm tiêu đề vào yêu cầu HTTP
instance.interceptors.request.use((config) => {
       const token = localStorageV.getItem(StoreKey.keyLockToken);
        console.log(token);
        // Thêm các tiêu đề vào yêu cầu HTTP ở đây
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Corporate-Code'] = realm;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// export function
window['axios'] = instance ;
window['localStorageV'] = localStorageV;
// Sử dụng instance để gọi API
// https://axios-http.com/docs/intro
// example
// setTimeout(() => {
//     window['axios'].get('https://example.com/api/some-endpoint')
//         .then((response) => {
//             console.log(response.data);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }, 10000)


