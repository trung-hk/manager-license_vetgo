
import * as crypto from 'crypto-js';
import EncUtf8 from 'crypto-js/enc-utf8';
const HASH_SALT = 'HASH_SALT';

const removeItem = (key: string): void => {
    return localStorage.removeItem(getKey(key));
}
const getItem = (key: string): string | null => {
    const value = localStorage.getItem(getKey(key));
    return value ? decrypt(value) : value;
}
const setItem = (key: string, value: string): void => {
    return localStorage.setItem(getKey(key), encrypt(value));
}

const hash = (value: string): string | null =>  {
    return value ? crypto.SHA256(HASH_SALT + value).toString() : value;
}

const encrypt = (value: string): string | null  => {
    try {
        return value ? crypto.AES.encrypt(value, HASH_SALT).toString() : value;
    } catch ( e) {
        console.log(e);
        return value;
    }

}

const decrypt = (value: string): string | null => {
    try {
        return value ? crypto.AES.decrypt(value, HASH_SALT).toString(EncUtf8) : value;
    } catch (e) {
        console.log(e);
        return value;
    }

}
const getKey = (rawKey: string): string => {
    return hash(rawKey.toLocaleLowerCase());
}
export const localStorageV = {
    removeItem,
    getItem,
    setItem
};
