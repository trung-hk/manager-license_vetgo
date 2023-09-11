import Keycloak from 'keycloak-js';
import axios from 'axios';
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
let realm  = 'datmt-test-realm';
if (storedCorporate) {
    realm = storedCorporate;
}
if (window.location.href.startsWith('https://phanmemvet.vn')) {
    realm  = 'datmt-test-realm';
}
const keycloak = new Keycloak({
    url: 'https://keycloak.phanmemvet.vn',
    realm: realm,
    clientId: 'spring-boot-client'
});
setTimeout(async () => {
    try {
        console.log("User is authenticated123");
        if (!localStorageV.getItem(StoreKey.keyLockToken)) {
            await keycloak.init({ onLoad: 'login-required' });
            localStorageV.setItem(StoreKey.keyLockToken, keycloak.token);
            }
        } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }
})

// intercept
const instance = axios.create();
// Tạo một interceptor để thêm tiêu đề vào yêu cầu HTTP
instance.interceptors.request.use(async (config) => {
    try {
        console.log("call request");
        const token = localStorageV.getItem(StoreKey.keyLockToken);
        if (!token) {
            let authenticated = await keycloak.init({ onLoad: 'login-required' });
            console.log("authen " + authenticated)
            if (authenticated) {
                localStorageV.setItem(StoreKey.keyLockToken, keycloak.token);
            }
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Corporate-Code'] = realm;
            return config;
        } else {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Corporate-Code'] = realm;
            return config;
        }
             } catch (error) {
        console.error('Failed to initialize adapter:', error);
        return config;
        }
    },
    (error) => {
        localStorageV.removeItem(StoreKey.keyLockToken);
        return Promise.reject(error);
    }
);
// export function
window['logout'] = async () => {
    await keycloak.init({ onLoad: 'check-sso' });
    await keycloak.logout();
}
window['keycloak'] = keycloak;
window['axios'] = instance ;
window['localStorageV'] = localStorageV;
// Sử dụng axios instance để gọi API
// https://axios-http.com/docs/intro
// example
//     window.axios.get('https://example.com/api/some-endpoint')
//         .then((response) => {
//             console.log(response.data);
//         })
//         .catch((error) => {
//             console.error(error);
//         });


